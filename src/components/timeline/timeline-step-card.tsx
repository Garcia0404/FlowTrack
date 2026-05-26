"use client";

import { motion } from "framer-motion";
import { AlertCircle, MessageSquare } from "lucide-react";
import type { FlowStep } from "@/types/flow";
import { STEP_STATUS_ICONS, STEP_STATUS_STYLES } from "@/constants/step-status";
import { StatusPill } from "@/components/ui/status-pill";
import { cn } from "@/lib/utils";

export function TimelineStepCard({
  step,
  isActive,
  isLast,
  onClick,
}: {
  step: FlowStep;
  isActive?: boolean;
  isLast?: boolean;
  onClick: () => void;
}) {
  const Icon = STEP_STATUS_ICONS[step.status];
  const styles = STEP_STATUS_STYLES[step.status];
  const lastComment = step.comments[step.comments.length - 1];

  return (
    <div className="relative flex gap-4 pb-8">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 bg-white",
            styles.border
          )}
        >
          <div className={cn("h-2.5 w-2.5 rounded-full", styles.dot)} />
        </div>
        {!isLast && (
          <div className="mt-1 w-px flex-1 bg-foreground/30" />
        )}
      </div>

      <motion.button
        type="button"
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "min-w-0 flex-1 rounded-2xl border bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md",
          styles.border,
          isActive && "ring-2 ring-[#0066cc]/35",
          step.status === "incomplete" &&
          "shadow-[0_0_0_1px_rgba(255,149,0,0.2)]"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  styles.text,
                  step.status === "in_progress" && "animate-spin"
                )}
              />
              <div className="min-w-0 flex-1 truncate text-[15px] font-semibold tracking-[-0.01em] text-foreground">
                {step.title}
              </div>
            </div>
            {step.description && (
              <p className="mt-1 line-clamp-2 break-all text-[13px] text-[#737373]">
                {step.description}
              </p>
            )}
          </div>
          <StatusPill status={step.status} />
        </div>

        {lastComment && (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-[#e5e5e5] bg-[#fafafa] px-3 py-2">
            <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#737373]" />
            <p className="text-[13px] text-[#404040] line-clamp-1">
              {lastComment.text}
            </p>
          </div>
        )}

        {step.checklist.length > 0 && (
          <p className="mt-2 text-[12px] font-medium text-[#737373]">
            {step.checklist.filter((c) => c.checked).length}/
            {step.checklist.length} checklist
          </p>
        )}
      </motion.button>
    </div>
  );
}
