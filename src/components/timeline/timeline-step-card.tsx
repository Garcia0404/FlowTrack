"use client";

import { MessageSquare } from "lucide-react";

import type { FlowStep } from "@/types/flow";

import {
  STEP_STATUS_ICONS,
  STEP_STATUS_STYLES,
} from "@/constants/step-status";

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
  const Icon =
    STEP_STATUS_ICONS[step.status];

  const styles =
    STEP_STATUS_STYLES[step.status];

  const lastComment =
    step.comments[
      step.comments.length - 1
    ];

  const completedChecklist =
    step.checklist.filter(
      (c) => c.checked
    ).length;

  return (
    <div className="relative flex gap-4 pb-8">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "relative z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-background",
            styles.border
          )}
        >
          <div
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              styles.dot
            )}
          />
        </div>

        {!isLast && (
          <div className="mt-1 w-px flex-1 bg-border" />
        )}
      </div>

      <button
        type="button"
        onClick={onClick}
        className={cn(
          `
          min-w-0
          flex-1
          rounded-3xl
          border
          border-border
          bg-card
          p-5
          text-left
          transition-all
          duration-200
          hover:border-foreground/15
          active:scale-[0.99]
        `,
          isActive &&
            "border-primary/30 ring-1 ring-primary/20"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  styles.text,
                  step.status ===
                    "in_progress" &&
                    "animate-spin"
                )}
              />

              <h3 className="truncate text-[17px] font-semibold tracking-[-0.02em] text-foreground">
                {step.title}
              </h3>
            </div>

            {step.description && (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground wrap-break-word">
                {step.description}
              </p>
            )}
          </div>

          <StatusPill
            status={step.status}
          />
        </div>

        {lastComment && (
          <div className="mt-4 flex items-start gap-2 rounded-2xl bg-muted px-3 py-2.5">
            <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />

            <p className="truncate text-[13px] text-muted-foreground">
              {lastComment.text}|
            </p>
          </div>
        )}

        {step.checklist.length > 0 && (
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
            <span className="text-xs text-muted-foreground">
              Checklist
            </span>

            <span className="text-xs font-medium text-foreground">
              {completedChecklist}/
              {step.checklist.length}
            </span>
          </div>
        )}
      </button>
    </div>
  );
}