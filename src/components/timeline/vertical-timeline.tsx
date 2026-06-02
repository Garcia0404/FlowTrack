"use client";

import type { Flow } from "@/types/flow";
import { TimelineStepCard } from "./timeline-step-card";
import { useUiStore } from "@/stores/ui-store";

export function VerticalTimeline({ flow }: { flow: Flow }) {
  const openStepPanel = useUiStore((s) => s.openStepPanel);
  const selectedStepId = useUiStore((s) => s.selectedStepId);

  const steps = [...flow.steps].sort((a, b) => a.order - b.order);

  return (
    <div className="mt-8">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both"
          style={{
            animationDelay: `${index * 50}ms`,
          }}
        >
          <TimelineStepCard
            step={step}
            isActive={selectedStepId === step.id}
            isLast={index === steps.length - 1}
            onClick={() => openStepPanel(step.id)}
          />
        </div>
      ))}
    </div>
  );
}