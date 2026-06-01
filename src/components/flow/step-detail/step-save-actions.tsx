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
    <div className="flex flex-wrap items-center gap-2 border-t border-[#e5e5e5] pt-4">
      <Button
        size="sm"
        onClick={onSave}
        disabled={!hasChanges}
        className="rounded-full bg-primary px-5 hover:bg-[#0055b3] disabled:opacity-40"
      >
        Guardar
      </Button>

      <Button
        variant="outline"
        size="sm"
        disabled={!hasChanges}
        onClick={onDiscard}
        className="rounded-full border-[#e5e5e5] text-[#737373] hover:text-[#404040] disabled:opacity-40"
      >
        Descartar
      </Button>
    </div>
  );
}