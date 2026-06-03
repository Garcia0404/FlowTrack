"use client";

import { AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { StepCommentItem } from "@/components/flow/step-detail/step-comment-item";

import type { StepComment } from "@/types/flow";
import { StepSectionTitle } from "./step-section-title";

interface StepCommentsSectionProps {
  comments: StepComment[];
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onDelete: (commentId: string) => void;
}

export function StepCommentsSection({
  comments,
  value,
  onChange,
  onSave,
  onDelete,
}: StepCommentsSectionProps) {
  return (
    <div>
      <StepSectionTitle>Comentarios</StepSectionTitle>

      <div className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {comments.map((comment) => (
            <StepCommentItem
              key={comment.id}
              comment={comment}
              onDelete={() =>
                onDelete(comment.id)
              }
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-3 space-y-3">
        <Textarea
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder="Ej: Cliente no respondió..."
          className="
            min-h-20
            resize-none
            rounded-2xl
            border-border
            bg-background
            placeholder:text-muted-foreground
          "
        />

        <Button
          size="sm"
          onClick={onSave}
          disabled={!value.trim()}
          className="
            rounded-full
            px-4
          "
        >
          Guardar comentario
        </Button>
      </div>
    </div>
  );
}