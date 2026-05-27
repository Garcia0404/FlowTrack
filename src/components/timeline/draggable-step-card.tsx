"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";
import { TimelineStepCard } from "./timeline-step-card";
import { cn } from "@/lib/utils";
import type { FlowStep } from "@/types/flow";

export function DraggableStepCard({
  step,
  isActive,
  isLast,
  onClick,
}: {
  step: FlowStep;
  isActive?: boolean;
  isLast?: boolean;
  onClick: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative flex pb-8">
      <div
        {...attributes}
        {...listeners}
        className="flex shrink-0 cursor-grab items-start pt-1 pr-2 text-[#c7c7cc] transition-colors hover:text-[#737373] active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <div className={cn("flex-1", isDragging && "opacity-50")}>
        <TimelineStepCard
          step={step}
          isActive={isActive}
          isLast={isLast}
          onClick={onClick}
        />
      </div>
    </div>
  );
}
