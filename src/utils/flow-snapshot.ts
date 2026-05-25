import type { Flow } from "@/types/flow";

/** Stable JSON snapshot for deep equality / dirty detection */
export function flowSnapshot(flow: Flow): string {
  const normalized = {
    ...flow,
    steps: [...flow.steps]
      .sort((a, b) => a.order - b.order)
      .map((s) => ({
        ...s,
        checklist: [...s.checklist].sort((a, b) => a.id.localeCompare(b.id)),
        comments: [...s.comments].sort((a, b) => a.id.localeCompare(b.id)),
        files: [...s.files].sort((a, b) => a.id.localeCompare(b.id)),
      })),
  };
  return JSON.stringify(normalized);
}

export function flowsAreEqual(a: Flow, b: Flow): boolean {
  return flowSnapshot(a) === flowSnapshot(b);
}
