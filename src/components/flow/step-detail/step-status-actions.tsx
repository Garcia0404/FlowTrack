"use client";

import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  stepId: string;
  setStepStatus: (
    stepId: string,
    status: "completed" | "incomplete" | "in_progress"
  ) => void;
}

export function StepStatusActions({
  stepId,
  setStepStatus,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="
          rounded-full
          border-border
        "
        onClick={() =>
          void setStepStatus(
            stepId,
            "completed"
          )
        }
      >
        <Check className="mr-1.5 h-4 w-4" />
        Marcar completo
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="
          rounded-full
          border-destructive/30
          text-destructive
          hover:bg-destructive/10
          hover:text-destructive
        "
        onClick={() =>
          void setStepStatus(
            stepId,
            "incomplete"
          )
        }
      >
        Marcar incompleto
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="
          rounded-full
          text-muted-foreground
          hover:text-foreground
        "
        onClick={() =>
          void setStepStatus(
            stepId,
            "in_progress"
          )
        }
      >
        En proceso
      </Button>
    </div>
  );
}