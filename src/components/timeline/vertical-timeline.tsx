"use client";

import { motion } from "framer-motion";
import type { Flow } from "@/types/flow";
import { TimelineStepCard } from "./timeline-step-card";
import { useUiStore } from "@/stores/ui-store";

export function VerticalTimeline({ flow }: { flow: Flow }) {
  const openStepPanel = useUiStore((s) => s.openStepPanel);
  const selectedStepId = useUiStore((s) => s.selectedStepId);
  const steps = [...flow.steps].sort((a, b) => a.order - b.order);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.05 } },
      }}
      className="mt-8"
    >
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <TimelineStepCard
            step={step}
            isActive={selectedStepId === step.id}
            isLast={index === steps.length - 1}
            onClick={() => openStepPanel(step.id)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
