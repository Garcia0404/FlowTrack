import { create } from "zustand";
import { flowService } from "@/services/flow.service";
import { createId } from "@/utils/id";
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
  reorderSteps: (stepIds: string[]) => Promise<void>;
  updateChecklistItem: (stepId: string, itemId: string, text?: string, completed?: boolean) => Promise<void>;
  deleteChecklistItem: (stepId: string, itemId: string) => Promise<void>;
  addChecklistItem: (stepId: string, text?: string) => Promise<void>;
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
    const flow = await flowService.startGuided(currentFlow.id);
    set({ currentFlow: flow });
    await get().loadFlows();
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
      await flowService.setStepStatus(currentFlow.id, step.id, "completed");
    }

    if (advance) {
      const flow = await flowService.advanceGuided(currentFlow.id);
      set({ currentFlow: flow });
    } else {
      await refreshCurrent(currentFlow.id, set);
    }
    await get().loadFlows();
  },

  reorderSteps: async (stepIds: string[]) => {
    const { currentFlow } = get();
    if (!currentFlow) return;
    
    const reorderedSteps = stepIds.map((id, index) => {
      const step = currentFlow.steps.find((s) => s.id === id);
      return step ? { ...step, order: index } : null;
    }).filter((s): s is FlowStep => s !== null);
    
    await flowService.update(currentFlow.id, { steps: reorderedSteps });
    await refreshCurrent(currentFlow.id, set);
  },

  updateChecklistItem: async (stepId: string, itemId: string, text?: string, completed?: boolean) => {
    const { currentFlow } = get();
    if (!currentFlow) return;
    
    const step = currentFlow.steps.find((s) => s.id === stepId);
    if (!step) return;
    
    const checklist = step.checklist.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          ...(text !== undefined && { text }),
          ...(completed !== undefined && { completed }),
        };
      }
      return item;
    });
    
    await flowService.updateStep(currentFlow.id, stepId, { checklist });
    await refreshCurrent(currentFlow.id, set);
  },

  deleteChecklistItem: async (stepId: string, itemId: string) => {
    const { currentFlow } = get();
    if (!currentFlow) return;
    
    const step = currentFlow.steps.find((s) => s.id === stepId);
    if (!step) return;
    
    const checklist = step.checklist.filter((item) => item.id !== itemId);
    
    await flowService.updateStep(currentFlow.id, stepId, { checklist });
    await refreshCurrent(currentFlow.id, set);
  },

  addChecklistItem: async (stepId: string, text = "") => {
    const { currentFlow } = get();
    if (!currentFlow) return;
    
    const step = currentFlow.steps.find((s) => s.id === stepId);
    if (!step) return;
    
    const checklist = [
      ...step.checklist,
      { id: createId("chk"), text, completed: false },
    ];
    
    await flowService.updateStep(currentFlow.id, stepId, { checklist });
    await refreshCurrent(currentFlow.id, set);
  },
}));
