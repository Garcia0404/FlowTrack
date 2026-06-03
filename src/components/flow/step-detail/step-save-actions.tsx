"use client";

import { Button } from "@/components/ui/button";

interface StepSaveActionsProps {
  hasChanges: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

export function StepSaveActions({
  hasChanges,
  onSave,
  onDiscard,
}: StepSaveActionsProps) {
  return (
    <div
      className="
        flex
        flex-wrap
        items-center
        gap-2
        border-t
        border-border
        pt-4
      "
    >
      <Button
        size="sm"
        onClick={onSave}
        disabled={!hasChanges}
        className="
          rounded-full
          px-5
          disabled:opacity-40
        "
      >
        Guardar
      </Button>

      <Button
        variant="outline"
        size="sm"
        disabled={!hasChanges}
        onClick={onDiscard}
        className="
          rounded-full
          border-border
          text-muted-foreground
          hover:text-foreground
          disabled:opacity-40
        "
      >
        Descartar
      </Button>
    </div>
  );
}