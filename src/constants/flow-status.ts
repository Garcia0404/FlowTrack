import type { FlowStatus } from "@/types/flow";

export const FLOW_STATUS_LABELS: Record<FlowStatus, string> = {
  draft: "Borrador",
  active: "Activo",
  completed: "Finalizado",
  paused: "Pausado",
};
