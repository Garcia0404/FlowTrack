"use client";

import { createId } from "@/utils/id";
import type { FlowStep } from "@/types/flow";

interface UseStepChecklistProps {
  step: FlowStep;
  updateStep: (
    stepId: string,
    patch: Partial<FlowStep>
  ) => Promise<void>;
}

export function useStepChecklist({
  step,
  updateStep,
}: UseStepChecklistProps) {
  const updateChecklist = (
    checklist: typeof step.checklist
  ) => {
    void updateStep(step.id, { checklist });
  };

  const toggleChecklist = (itemId: string) => {
    updateChecklist(
      step.checklist.map((item) =>
        item.id === itemId
          ? { ...item, checked: !item.checked }
          : item
      )
    );
  };

  const updateChecklistItem = (
    itemId: string,
    label: string
  ) => {
    updateChecklist(
      step.checklist.map((item) =>
        item.id === itemId
          ? { ...item, label }
          : item
      )
    );
  };

  const deleteChecklistItem = (itemId: string) => {
    updateChecklist(
      step.checklist.filter(
        (item) => item.id !== itemId
      )
    );
  };

  const addChecklistItem = () => {
    updateChecklist([
      ...step.checklist,
      {
        id: createId("chk"),
        label: "",
        checked: false,
      },
    ]);
  };

  return {
    toggleChecklist,
    updateChecklistItem,
    deleteChecklistItem,
    addChecklistItem,
  };
}