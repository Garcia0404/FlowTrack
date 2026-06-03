"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import type { ChecklistItem } from "@/types/flow";

interface ChecklistItemRowProps {
  item: ChecklistItem;
  onToggle: (itemId: string) => void;
  onUpdate: (itemId: string, label: string) => void;
  onDelete: (itemId: string) => void;
}

export function ChecklistItemRow({
  item,
  onToggle,
  onUpdate,
  onDelete,
}: ChecklistItemRowProps) {
  const [isEditing, setIsEditing] =
    useState(item.label.trim() === "");

  const [editValue, setEditValue] =
    useState(item.label);

  useEffect(() => {
    setEditValue(item.label);

    if (item.label.trim() === "") {
      setIsEditing(true);
    }
  }, [item.label]);

  const handleSaveEdit = () => {
    const trimmed = editValue.trim();

    if (trimmed !== item.label) {
      onUpdate(item.id, trimmed);
    }

    setIsEditing(false);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    }

    if (e.key === "Escape") {
      setEditValue(item.label);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: -4,
        height: 0,
      }}
      animate={{
        opacity: 1,
        y: 0,
        height: "auto",
      }}
      exit={{
        opacity: 0,
        y: -4,
        height: 0,
      }}
      transition={{
        duration: 0.2,
      }}
      className="overflow-hidden"
    >
      <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5">
        <Checkbox
          checked={item.checked}
          onCheckedChange={() =>
            onToggle(item.id)
          }
          className="shrink-0"
        />

        {isEditing ? (
          <Input
            value={editValue}
            onChange={(e) =>
              setEditValue(e.target.value)
            }
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
            placeholder="Escribe la tarea..."
            className="h-8 flex-1"
          />
        ) : (
          <button
            type="button"
            onClick={() =>
              setIsEditing(true)
            }
            className={`flex-1 text-left text-sm ${
              item.checked
                ? "line-through text-muted-foreground"
                : "text-foreground"
            }`}
          >
            {item.label}
          </button>
        )}

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() =>
            onDelete(item.id)
          }
          className="h-7 w-7 shrink-0 rounded-full text-muted-foreground hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}