import { getFlowRepository } from "@/lib/repository-factory";
import type {
  CreateFlowInput,
  Flow,
  FlowStep,
  StepComment,
  StepStatus,
  UpdateFlowInput,
} from "@/types/flow";
import { createId } from "@/utils/id";
import { nowIso } from "@/utils/date";

export class FlowService {
  private repo = getFlowRepository();

  findAll() {
    return this.repo.findAll();
  }

  findById(id: string) {
    return this.repo.findById(id);
  }

  create(input: CreateFlowInput) {
    return this.repo.create(input);
  }

  update(id: string, input: UpdateFlowInput) {
    return this.repo.update(id, input);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }

  async updateStep(
    flowId: string,
    stepId: string,
    patch: Partial<FlowStep>
  ): Promise<Flow> {
    const flow = await this.repo.findById(flowId);
    if (!flow) throw new Error("Flow not found");

    const steps = flow.steps.map((s) =>
      s.id === stepId ? { ...s, ...patch, updatedAt: nowIso() } : s
    );
    return this.repo.update(flowId, { steps });
  }

  async setStepStatus(
    flowId: string,
    stepId: string,
    status: StepStatus
  ): Promise<Flow> {
    return this.updateStep(flowId, stepId, { status });
  }

  async addComment(
    flowId: string,
    stepId: string,
    text: string
  ): Promise<Flow> {
    const flow = await this.repo.findById(flowId);
    if (!flow) throw new Error("Flow not found");

    const comment: StepComment = {
      id: createId("comment"),
      text,
      createdAt: nowIso(),
    };

    const steps = flow.steps.map((s) =>
      s.id === stepId
        ? {
            ...s,
            comments: [...s.comments, comment],
            updatedAt: nowIso(),
          }
        : s
    );
    return this.repo.update(flowId, { steps });
  }

  async deleteComment(
    flowId: string,
    stepId: string,
    commentId: string
  ): Promise<Flow> {
    const flow = await this.repo.findById(flowId);
    if (!flow) throw new Error("Flow not found");

    const steps = flow.steps.map((s) =>
      s.id === stepId
        ? {
            ...s,
            comments: s.comments.filter((c) => c.id !== commentId),
            updatedAt: nowIso(),
          }
        : s
    );
    return this.repo.update(flowId, { steps });
  }

  async restoreFlow(saved: Flow): Promise<Flow> {
    return this.repo.update(saved.id, {
      title: saved.title,
      description: saved.description,
      date: saved.date,
      status: saved.status,
      steps: saved.steps,
      guidedStepIndex: saved.guidedStepIndex,
      isGuidedActive: saved.isGuidedActive,
    });
  }

  async startGuided(flowId: string): Promise<Flow> {
    const flow = await this.repo.findById(flowId);
    if (!flow) throw new Error("Flow not found");

    const firstPending =
      flow.steps.findIndex((s) => s.status !== "completed") ?? 0;

    const steps = flow.steps.map((s, i) =>
      i === firstPending && s.status === "pending"
        ? { ...s, status: "in_progress" as const, updatedAt: nowIso() }
        : s
    );

    return this.repo.update(flowId, {
      status: "active",
      isGuidedActive: true,
      guidedStepIndex: Math.max(0, firstPending),
      steps,
    });
  }

  async stopGuided(flowId: string): Promise<Flow> {
    return this.repo.update(flowId, {
      isGuidedActive: false,
      guidedStepIndex: null,
    });
  }

  async advanceGuided(flowId: string): Promise<Flow> {
    const flow = await this.repo.findById(flowId);
    if (!flow || flow.guidedStepIndex === null) return flow!;

    const current = flow.guidedStepIndex;
    const next = flow.steps.findIndex(
      (s, i) => i > current && s.status !== "completed"
    );

    if (next === -1) {
      return this.repo.update(flowId, {
        isGuidedActive: false,
        guidedStepIndex: null,
        status: "completed",
      });
    }

    const steps = flow.steps.map((s, i) => {
      if (i === next && s.status === "pending") {
        return { ...s, status: "in_progress" as const, updatedAt: nowIso() };
      }
      return s;
    });

    return this.repo.update(flowId, {
      guidedStepIndex: next,
      steps,
    });
  }
}

export const flowService = new FlowService();
