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
      className="group overflow-hidden rounded-xl border border-[#e5e5e5] bg-white px-3 py-2"
    >
      <div className="relative">
        <div className="absolute top-0 right-0">
          <AnimatePresence mode="wait">
            {confirming ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-1.5 rounded-md bg-white px-2 py-1 shadow-md"
              >
                <button
                  type="button"
                  onClick={() => {
                    onDelete();
                    setConfirming(false);
                  }}
                  className="text-[11px] font-medium text-[#c93400] hover:underline"
                >
                  Eliminar
                </button>

                <span className="text-[#d4d4d4]">·</span>

                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="text-[11px] text-[#737373] hover:text-[#404040]"
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
                onClick={() => setConfirming(true)}
                className="rounded-md p-1 text-[#737373] opacity-0 transition-opacity hover:bg-[#f5f5f5] hover:text-[#404040] group-hover:opacity-100"
                aria-label="Eliminar comentario"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="min-w-0">
          <p className="me-4.5 text-sm text-foreground wrap-break-word">
            {comment.text}
          </p>

          <p className="mt-1 text-[11px] text-[#737373]">
            {formatDateTime(comment.createdAt)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}