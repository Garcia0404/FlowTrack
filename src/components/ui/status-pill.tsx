import type { StepStatus } from "@/types/flow";
import { STEP_STATUS_LABELS, STEP_STATUS_STYLES } from "@/constants/step-status";
import { cn } from "@/lib/utils";

export function StatusPill({
  status,
  className,
}: {
  status: StepStatus;
  className?: string;
}) {
  const styles = STEP_STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        styles.bg,
        styles.border,
        styles.text,
        className
      )}
    >
      {STEP_STATUS_LABELS[status]}
    </span>
  );
}
