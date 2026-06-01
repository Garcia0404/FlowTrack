"use client";

import { StatusPill } from "@/components/ui/status-pill";
import { formatDateTime } from "@/utils/date";
import type { FlowStep } from "@/types/flow";

interface StepHeaderProps {
  status: FlowStep["status"];
  updatedAt: string;
}

export function StepHeader({
  status,
  updatedAt,
}: StepHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <StatusPill status={status} />

      <span className="text-[12px] text-[#737373]">
        {formatDateTime(updatedAt)}
      </span>
    </div>
  );
}