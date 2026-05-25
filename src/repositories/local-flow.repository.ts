import { localStorageAdapter } from "@/adapters/local-storage.adapter";
import { STORAGE_KEYS } from "@/constants/storage";
import type { CreateFlowInput, Flow, FlowStep, UpdateFlowInput } from "@/types/flow";
import type { IFlowRepository } from "@/types/repositories";
import { createId } from "@/utils/id";
import { nowIso } from "@/utils/date";

function createDefaultStep(order: number, partial?: Partial<FlowStep>): FlowStep {
  const ts = nowIso();
  return {
    id: createId("step"),
    title: partial?.title ?? `Paso ${order + 1}`,
    description: partial?.description ?? "",
    status: partial?.status ?? "pending",
    checklist: partial?.checklist ?? [],
    comments: partial?.comments ?? [],
    observations: partial?.observations ?? "",
    files: partial?.files ?? [],
    order,
    createdAt: ts,
    updatedAt: ts,
  };
}

export class LocalFlowRepository implements IFlowRepository {
  private read(): Flow[] {
    return localStorageAdapter.get<Flow[]>(STORAGE_KEYS.flows, []);
  }

  private write(flows: Flow[]): void {
    localStorageAdapter.set(STORAGE_KEYS.flows, flows);
  }

  async findAll(): Promise<Flow[]> {
    return this.read().sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async findById(id: string): Promise<Flow | null> {
    return this.read().find((f) => f.id === id) ?? null;
  }

  async create(input: CreateFlowInput): Promise<Flow> {
    const ts = nowIso();
    const steps =
      input.steps?.map((s, i) =>
        createDefaultStep(i, { ...s, order: i })
      ) ?? [createDefaultStep(0)];

    const flow: Flow = {
      id: createId("flow"),
      title: input.title,
      description: input.description,
      date: input.date,
      status: "draft",
      steps,
      guidedStepIndex: null,
      isGuidedActive: false,
      createdAt: ts,
      updatedAt: ts,
    };

    const flows = this.read();
    flows.push(flow);
    this.write(flows);
    return flow;
  }

  async update(id: string, input: UpdateFlowInput): Promise<Flow> {
    const flows = this.read();
    const index = flows.findIndex((f) => f.id === id);
    if (index === -1) throw new Error("Flow not found");

    const updated: Flow = {
      ...flows[index],
      ...input,
      updatedAt: nowIso(),
    };
    flows[index] = updated;
    this.write(flows);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.write(this.read().filter((f) => f.id !== id));
  }

  async saveAll(flows: Flow[]): Promise<void> {
    this.write(flows);
  }
}
