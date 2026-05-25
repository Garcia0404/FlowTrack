"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import type { StepComment } from "@/types/flow";
import { formatDateTime } from "@/utils/date";

export function StepCommentItem({
  comment,
  onDelete,
}: {
  comment: StepComment;
  onDelete: () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    onDelete();
    setConfirming(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="group rounded-xl border border-[#e5e5e5] bg-white px-3 py-2"
    >
      <motion.div
        layout
        className="relative"
      >

        <AnimatePresence>
          <div className="absolute top-0 right-0">
            {confirming ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex shrink-0 items-center gap-1.5"
              >
                <button
                  type="button"
                  onClick={handleDelete}
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
                className="shrink-0 rounded-md p-1 text-[#737373] opacity-0 transition-opacity hover:bg-[#f5f5f5] hover:text-[#404040] group-hover:opacity-100"
                aria-label="Eliminar comentario"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </motion.button>
            )}
          </div>
        </AnimatePresence>
        <motion.div layout className="min-w-0 flex-1">
          <p className="text-[14px] text-foreground">{comment.text}</p>
          <p className="mt-1 text-[11px] text-[#737373]">
            {formatDateTime(comment.createdAt)}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
