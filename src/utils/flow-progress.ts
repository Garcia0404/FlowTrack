import type { Flow, FlowProgress } from "@/types/flow";

export function computeFlowProgress(flow: Flow): FlowProgress {
  const total = flow.steps.length;
  const completed = flow.steps.filter((s) => s.status === "completed").length;
  const incomplete = flow.steps.filter((s) => s.status === "incomplete").length;
  const inProgress = flow.steps.filter((s) => s.status === "in_progress").length;
  const pending = flow.steps.filter((s) => s.status === "pending").length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { total, completed, incomplete, inProgress, pending, percent };
}
