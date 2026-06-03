"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#d4d4d4] bg-background px-8 py-20 text-center"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f5f5]">
        <Icon className="h-6 w-6 text-[#737373]" />
      </div>
      <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-[#737373]">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="mt-8 rounded-full bg-[#0066cc] px-6 hover:bg-[#0055b3]"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
