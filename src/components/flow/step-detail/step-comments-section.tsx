"use client";

import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StepCommentItem } from "@/components/flow/step-detail/step-comment-item";
import type { StepComment } from "@/types/flow";

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
      <h4 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-[#404040]">
        Comentarios
      </h4>

      <div className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {comments.map((comment) => (
            <StepCommentItem
              key={comment.id}
              comment={comment}
              onDelete={() => onDelete(comment.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-3 space-y-2">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ej: Cliente no respondió..."
          className="min-h-20 resize-none rounded-xl border-[#e5e5e5] placeholder:text-[#737373]"
        />

        <Button
          size="sm"
          onClick={onSave}
          disabled={!value.trim()}
          className="rounded-full bg-[#0066cc]"
        >
          Guardar comentario
        </Button>
      </div>
    </div>
  );
}