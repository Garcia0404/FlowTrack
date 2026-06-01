"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ChecklistItem } from "@/types/flow";

interface ChecklistItemRowProps {
  item: ChecklistItem;
  onToggle: (itemId: string) => void;
  onUpdate: (itemId: string, label: string) => void;
  onDelete: (itemId: string) => void;
  isNew?: boolean;
}

export function ChecklistItemRow({
  item,
  onToggle,
  onUpdate,
  onDelete,
  isNew = false,
}: ChecklistItemRowProps) {
  const [isEditing, setIsEditing] = useState(isNew);
  const [editValue, setEditValue] = useState(item.label);

  useEffect(() => {
    setEditValue(item.label);
  }, [item.label]);

  const handleSaveEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== item.label) {
      onUpdate(item.id, trimmed);
    } else if (!trimmed) {
      // Si está vacío, revertir
      setEditValue(item.label);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      setEditValue(item.label);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -4, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -4, height: 0 }}
      transition={{ duration: 0.2 }}
      className="group overflow-hidden"
    >
      <div className="flex items-center gap-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] px-3 py-2.5 transition-colors hover:bg-white">
        <Checkbox
          checked={item.checked}
          onCheckedChange={() => onToggle(item.id)}
          className="shrink-0"
        />

        {isEditing ? (
          <Input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
            placeholder="Escribe la tarea..."
            className="h-7 border-[#0066cc] flex-1 rounded-md border bg-white text-[14px] focus-visible:ring-1 focus-visible:ring-[#0066cc] focus-visible:ring-offset-0"
          />
        ) : (
          <span
            onClick={() => setIsEditing(true)}
            className={`flex-1 cursor-text rounded px-1 py-1 text-[14px] transition-colors hover:bg-[#f5f5f5] ${
              item.checked
                ? "line-through text-[#737373]"
                : "text-foreground"
            }`}
          >
            {item.label}
          </span>
        )}

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onDelete(item.id)}
          className="shrink-0 h-7 w-7 text-[#737373] opacity-0 transition-opacity hover:bg-[#ff9500]/10 hover:text-[#c93400] group-hover:opacity-100"
          aria-label="Eliminar tarea"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}
