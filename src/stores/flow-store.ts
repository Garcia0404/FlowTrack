import { create } from "zustand";
import { flowService } from "@/services/flow.service";
import type {
  CreateFlowInput,
  Flow,
  FlowStep,
  StepStatus,
  UpdateFlowInput,
} from "@/types/flow";

interface FlowState {
  flows: Flow[];
  currentFlow: Flow | null;
  isLoading: boolean;
  error: string | null;
  loadFlows: () => Promise<void>;
  loadFlow: (id: string) => Promise<void>;
  createFlow: (input: CreateFlowInput) => Promise<Flow>;
  updateFlow: (id: string, input: UpdateFlowInput) => Promise<Flow>;
  deleteFlow: (id: string) => Promise<void>;
  setCurrentFlow: (flow: Flow | null) => void;
  updateStepLocal: (stepId: string, patch: Partial<FlowStep>) => Promise<void>;
  setStepStatus: (stepId: string, status: StepStatus) => Promise<void>;
  addComment: (stepId: string, text: string) => Promise<void>;
  deleteComment: (stepId: string, commentId: string) => Promise<void>;
  discardToSaved: (saved: Flow) => Promise<void>;
  startGuided: () => Promise<void>;
  stopGuided: () => Promise<void>;
  goToGuidedStep: (index: number) => Promise<void>;
  completeGuidedStep: (advance?: boolean) => Promise<void>;
}

async function refreshCurrent(
  flowId: string,
  set: (partial: Partial<FlowState>) => void
) {
  const flow = await flowService.findById(flowId);
  if (flow) set({ currentFlow: flow });
  const flows = await flowService.findAll();
  set({ flows });
}

export const useFlowStore = create<FlowState>((set, get) => ({
  flows: [],
  currentFlow: null,
  isLoading: false,
  error: null,

  loadFlows: async () => {
    set({ isLoading: true });
    try {
      const flows = await flowService.findAll();
      set({ flows, isLoading: false });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Error",
        isLoading: false,
      });
    }
  },

  loadFlow: async (id) => {
    set({ isLoading: true });
    try {
      const flow = await flowService.findById(id);
      set({ currentFlow: flow, isLoading: false });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Error",
        isLoading: false,
      });
    }
  },

  createFlow: async (input) => {
    const flow = await flowService.create(input);
    await get().loadFlows();
    return flow;
  },

  updateFlow: async (id, input) => {
    const flow = await flowService.update(id, input);
    set({ currentFlow: flow });
    await get().loadFlows();
    return flow;
  },

  deleteFlow: async (id) => {
    await flowService.delete(id);
    set({ currentFlow: null });
    await get().loadFlows();
  },

  setCurrentFlow: (flow) => set({ currentFlow: flow }),

  updateStepLocal: async (stepId, patch) => {
    const { currentFlow } = get();
    if (!currentFlow) return;
    await flowService.updateStep(currentFlow.id, stepId, patch);
    await refreshCurrent(currentFlow.id, set);
  },

  setStepStatus: async (stepId, status) => {
    const { currentFlow } = get();
    if (!currentFlow) return;
    await flowService.setStepStatus(currentFlow.id, stepId, status);
    await refreshCurrent(currentFlow.id, set);
  },

  addComment: async (stepId, text) => {
    const { currentFlow } = get();
    if (!currentFlow) return;
    await flowService.addComment(currentFlow.id, stepId, text);
    await refreshCurrent(currentFlow.id, set);
  },

  deleteComment: async (stepId, commentId) => {
    const { currentFlow } = get();
    if (!currentFlow) return;
    await flowService.deleteComment(currentFlow.id, stepId, commentId);
    await refreshCurrent(currentFlow.id, set);
  },

  discardToSaved: async (saved) => {
    const flow = await flowService.restoreFlow(saved);
    set({ currentFlow: flow });
    await get().loadFlows();
  },

  startGuided: async () => {
    const { currentFlow } = get();

    if (!currentFlow) return;

    const flow =
      await flowService.startGuided(
        currentFlow.id
      );

    set((state) => ({
      currentFlow: flow,
      flows: state.flows.map((f) =>
        f.id === flow.id ? flow : f
      ),
    }));
  },

  stopGuided: async () => {
    const { currentFlow } = get();
    if (!currentFlow) return;
    const flow = await flowService.stopGuided(currentFlow.id);
    set({ currentFlow: flow });
  },

  goToGuidedStep: async (index) => {
    const { currentFlow } = get();
    if (!currentFlow) return;
    const flow = await flowService.update(currentFlow.id, {
      guidedStepIndex: index,
      isGuidedActive: true,
    });
    set({ currentFlow: flow });
  },

  completeGuidedStep: async (advance = true) => {
    const { currentFlow } = get();

    if (!currentFlow || currentFlow.guidedStepIndex === null) return;

    const step = currentFlow.steps[currentFlow.guidedStepIndex];

    if (step) {
      await flowService.setStepStatus(
        currentFlow.id,
        step.id,
        "completed"
      );
    }

    if (advance) {
      const flow = await flowService.advanceGuided(currentFlow.id);

      set({ currentFlow: flow });
    } else {
      await refreshCurrent(currentFlow.id, set);
    }
  },
}));
