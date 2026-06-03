"use client";

import type { Flow } from "@/types/flow";

import { computeFlowProgress } from "@/utils/flow-progress";
import { formatRelative } from "@/utils/date";

import { Progress } from "@/components/ui/progress";

import { FLOW_STATUS_LABELS } from "@/constants/flow-status";

export function FlowProgressHeader({
  flow,
}: {
  flow: Flow;
}) {
  const progress =
    computeFlowProgress(flow);

  return (
    <header className="space-y-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 flex-1">
          <span className="inline-flex rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
            {
              FLOW_STATUS_LABELS[
                flow.status
              ]
            }
          </span>

          <h1 className="mt-4 text-[34px] font-semibold leading-[1.2] tracking-[-0.03em] text-foreground text-balance">
            {flow.title}
          </h1>

          {flow.description && (
            <p className="mt-3 max-w-2xl text-[17px] leading-[1.47] tracking-[-0.01em] text-muted-foreground text-pretty">
              {flow.description}
            </p>
          )}
        </div>

        <div className="flex flex-col items-start gap-1 lg:items-end">
          <div className="text-[28px] font-normal tracking-tight text-foreground">
            {progress.percent}%
          </div>

          <p className="text-sm text-muted-foreground">
            completado
          </p>

          {progress.incomplete > 0 && (
            <p className="text-xs font-medium text-destructive">
              {progress.incomplete} pendiente
              {progress.incomplete > 1
                ? "s"
                : ""}
            </p>
          )}

          <p className="mt-1 text-xs text-muted-foreground">
            Actualizado{" "}
            {formatRelative(
              flow.updatedAt
            )}
          </p>
        </div>
      </div>

      <Progress
        value={progress.percent}
        className="h-1.5"
      />
    </header>
  );
}