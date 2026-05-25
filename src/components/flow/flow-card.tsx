"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { Flow } from "@/types/flow";
import { computeFlowProgress } from "@/utils/flow-progress";
import { formatDate, formatRelative } from "@/utils/date";
import { FLOW_STATUS_LABELS } from "@/constants/flow-status";
import { Progress } from "@/components/ui/progress";

export function FlowCard({ flow, index }: { flow: Flow; index: number }) {
  const progress = computeFlowProgress(flow);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
    >
      <Link
        href={`/flows/${flow.id}`}
        className="group flex items-center gap-4 rounded-2xl border border-foreground/30 bg-white p-5 transition-all hover:border-foreground/50 hover:shadow-sm"
      >
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-foreground/70">
            {FLOW_STATUS_LABELS[flow.status]} · {formatDate(flow.date)}
          </p>
          <div className="mt-1 truncate text-[17px] font-semibold tracking-[-0.02em] text-foreground">
            {flow.title}
          </div>
          <p className="mt-1 line-clamp-1 text-[14px] text-foreground/70">
            {flow.description || "Sin descripción"}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <Progress
              value={progress.percent}
              className="h-1.5 max-w-[120px] flex-1 bg-foreground/10"
            />
            <span className="text-xs font-medium text-foreground/70">
              {progress.completed}/{progress.total}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-foreground/70">
            {formatRelative(flow.updatedAt)}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-[#737373] transition-transform group-hover:translate-x-0.5 group-hover:text-[#404040]" />
      </Link>
    </motion.div>
  );
}
