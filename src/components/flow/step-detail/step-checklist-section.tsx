"use client";

import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChecklistItemRow } from "@/components/flow/step-detail/checklist-item-row";
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
      <h4 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-[#404040]">
        Checklist
      </h4>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {checklist.map((item) => (
            <ChecklistItemRow
              key={item.id}
              item={item}
              onToggle={onToggle}
              onUpdate={onUpdate}
              onDelete={onDelete}
              isNew={item.label === ""}
            />
          ))}
        </AnimatePresence>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onAdd}
        className="mt-2 rounded-full text-[#0066cc]"
      >
        + Añadir ítem
      </Button>
    </div>
  );
}