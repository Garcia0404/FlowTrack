"use client";

import { useState, useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFlowStore } from "@/stores/flow-store";

interface ChecklistItemEditorProps {
  stepId: string;
  itemId: string;
  text: string;
  completed: boolean;
  onDelete: () => void;
  isNew?: boolean;
}

export function ChecklistItemEditor({
  stepId,
  itemId,
  text,
  completed,
  onDelete,
  isNew = false,
}: ChecklistItemEditorProps) {
  const [isEditing, setIsEditing] = useState(isNew);
  const [value, setValue] = useState(text);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateChecklistItem = useFlowStore((s) => s.updateChecklistItem);
  const deleteChecklistItem = useFlowStore((s) => s.deleteChecklistItem);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (value.trim()) {
      await updateChecklistItem(stepId, itemId, value.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void handleSave();
    } else if (e.key === "Escape") {
      setValue(text);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    await deleteChecklistItem(stepId, itemId);
    onDelete();
  };

  const handleToggle = async () => {
    await updateChecklistItem(stepId, itemId, undefined, !completed);
  };

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] px-3 py-2.5">
      <Checkbox
        checked={completed}
        onCheckedChange={handleToggle}
        disabled={isEditing}
      />
      {isEditing ? (
        <div className="min-w-0 flex-1">
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            placeholder="Descripción de la tarea"
            className="h-7 border-0 bg-white p-0 text-[14px] placeholder:text-[#c7c7cc] focus-visible:ring-0"
          />
        </div>
      ) : (
        <span
          onClick={() => setIsEditing(true)}
          className={`min-w-0 flex-1 cursor-text text-[14px] ${
            completed ? "text-[#737373] line-through" : "text-foreground"
          }`}
        >
          {value || "(sin descripción)"}
        </span>
      )}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleDelete}
        className="h-7 w-7 shrink-0 rounded-md p-0 text-[#737373] hover:bg-white hover:text-[#c93400]"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
