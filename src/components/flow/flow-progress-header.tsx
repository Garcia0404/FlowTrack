"use client";

import type { Flow } from "@/types/flow";
import { computeFlowProgress } from "@/utils/flow-progress";
import { formatRelative } from "@/utils/date";
import { Progress } from "@/components/ui/progress";
import { FLOW_STATUS_LABELS } from "@/constants/flow-status";

export function FlowProgressHeader({ flow }: { flow: Flow }) {
  const progress = computeFlowProgress(flow);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-foreground/70">
            {FLOW_STATUS_LABELS[flow.status]}
          </p>
          <h1 className="mt-1 text-2xl break-all font-semibold tracking-[-0.03em] text-foreground sm:text-3xl">
            {flow.title}
          </h1>
          {flow.description && (
            <p className="mt-1 max-w-xl break-all text-sm leading-relaxed text-foreground/70">
              {flow.description}
            </p>
          )}
        </div>
        <div className="text-right text-[13px] text-foreground/70 flex items-center w-full justify-between">
          <p className="font-medium text-foreground">{progress.percent}% completado</p>
          {progress.incomplete > 0 && (
            <p className="font-medium text-red-700 text-xs">
              {progress.incomplete} incompleto{progress.incomplete > 1 ? "s" : ""}
            </p>
          )}
          <p className="text-xs">Actualizado {formatRelative(flow.updatedAt)}</p>
        </div>
      </div>

      <Progress value={progress.percent} className="h-1.5 bg-gray-200" />
    </div>
  );
}
