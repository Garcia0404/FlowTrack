"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";

import type { StepComment } from "@/types/flow";
import { formatDateTime } from "@/utils/date";

interface StepCommentItemProps {
  comment: StepComment;
  onDelete: () => void;
}

export function StepCommentItem({
  comment,
  onDelete,
}: StepCommentItemProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        y: -6,
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        borderWidth: 0,
      }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      className="
        group
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-card
        px-3
        py-2.5
      "
    >
      <div className="relative">
        <div className="absolute right-0 top-0">
          <AnimatePresence mode="wait">
            {confirming ? (
              <motion.div
                key="confirm"
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                }}
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-lg
                  border
                  border-border
                  bg-background
                  px-2
                  py-1
                  shadow-sm
                "
              >
                <button
                  type="button"
                  onClick={() => {
                    onDelete();
                    setConfirming(false);
                  }}
                  className="
                    text-[11px]
                    font-medium
                    text-destructive
                    transition-colors
                    hover:opacity-80
                  "
                >
                  Eliminar
                </button>

                <span className="text-border">
                  ·
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setConfirming(false)
                  }
                  className="
                    text-[11px]
                    text-muted-foreground
                    transition-colors
                    hover:text-foreground
                  "
                >
                  Cancelar
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="trash"
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() =>
                  setConfirming(true)
                }
                className="
                  rounded-md
                  p-1
                  text-muted-foreground
                  opacity-0
                  transition-all
                  hover:bg-accent
                  hover:text-foreground
                  group-hover:opacity-100
                "
                aria-label="Eliminar comentario"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="min-w-0">
          <p
            className="
              me-5
              wrap-break-words
              text-sm
              text-foreground
            "
          >
            {comment.text}
          </p>

          <p
            className="
              mt-1
              text-[11px]
              text-muted-foreground
            "
          >
            {formatDateTime(
              comment.createdAt
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
}