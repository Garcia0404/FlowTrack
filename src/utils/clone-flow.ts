import type { Flow } from "@/types/flow";

/** Deep clone for edit session snapshots */
export function cloneFlow(flow: Flow): Flow {
  return JSON.parse(JSON.stringify(flow)) as Flow;
}
