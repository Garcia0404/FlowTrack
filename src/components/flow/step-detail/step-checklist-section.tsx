"use client";

import { Button } from "@/components/ui/button";
import { ChecklistItemRow } from "@/components/flow/step-detail/checklist-item-row";
import { StepSectionTitle } from "@/components/flow/step-detail/step-section-title";
import type { ChecklistItem } from "@/types/flow";

interface Props {
  checklist: ChecklistItem[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, label: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function StepChecklistSection({
  checklist,
  onToggle,
  onUpdate,
  onDelete,
  onAdd,
}: Props) {
  return (
    <div>
      <StepSectionTitle>
        Checklist
      </StepSectionTitle>

      {checklist.length > 0 ? (
        <div className="space-y-2">
          {checklist.map((item) => (
            <ChecklistItemRow
              key={item.id}
              item={item}
              onToggle={onToggle}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No hay ítems todavía.
        </p>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={onAdd}
        className="mt-2 rounded-full text-primary"
      >
        + Añadir ítem
      </Button>
    </div>
  );
}