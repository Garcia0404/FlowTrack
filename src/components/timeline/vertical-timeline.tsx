"use client";

import { motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Flow } from "@/types/flow";
import { DraggableStepCard } from "./draggable-step-card";
import { useUiStore } from "@/stores/ui-store";
import { useFlowStore } from "@/stores/flow-store";

export function VerticalTimeline({ flow }: { flow: Flow }) {
  const openStepPanel = useUiStore((s) => s.openStepPanel);
  const selectedStepId = useUiStore((s) => s.selectedStepId);
  const reorderSteps = useFlowStore((s) => s.reorderSteps);
  const steps = [...flow.steps].sort((a, b) => a.order - b.order);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = steps.findIndex((s) => s.id === active.id);
      const newIndex = steps.findIndex((s) => s.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newSteps = Array.from(steps);
        const [movedStep] = newSteps.splice(oldIndex, 1);
        newSteps.splice(newIndex, 0, movedStep);

        const reorderedIds = newSteps.map((s) => s.id);
        void reorderSteps(reorderedIds);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={steps.map((s) => s.id)} strategy={verticalListSortingStrategy}>
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
              <DraggableStepCard
                step={step}
                isActive={selectedStepId === step.id}
                isLast={index === steps.length - 1}
                onClick={() => openStepPanel(step.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </SortableContext>
    </DndContext>
  );
}
