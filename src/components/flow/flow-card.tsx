"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import type { Flow } from "@/types/flow";

import { computeFlowProgress } from "@/utils/flow-progress";
import { formatDate, formatRelative } from "@/utils/date";

import { FLOW_STATUS_LABELS } from "@/constants/flow-status";

import { Progress } from "@/components/ui/progress";

export function FlowCard({
  flow,
}: {
  flow: Flow;
}) {
  const progress = computeFlowProgress(flow);

  return (
    <Link
      href={`/flows/${flow.id}`}
      className="group flex items-center gap-5 rounded-2xl border border-border bg-card p-6 transition-colors hover:bg-accent/40"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">
          {FLOW_STATUS_LABELS[flow.status]} ·{" "}
          {formatDate(flow.date)}
        </p>

        <h2 className="mt-1 truncate text-[17px] font-semibold tracking-[-0.02em] text-foreground">
          {flow.title}
        </h2>

        <p className="mt-2 line-clamp-1 text-[15px] leading-relaxed text-muted-foreground">
          {flow.description ||
            "Sin descripción"}
        </p>

        <div className="mt-4 flex items-center gap-3">
          <Progress
            value={progress.percent}
            className="h-1.5 flex-1 max-w-32"
          />

          <span className="text-xs text-muted-foreground">
            {progress.completed}/
            {progress.total}
          </span>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          {formatRelative(flow.updatedAt)}
        </p>
      </div>

      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
    </Link>
  );
}