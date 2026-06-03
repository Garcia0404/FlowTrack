"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import { StepDetailContent } from "@/components/flow/step-detail/step-detail-content";

import { useFlowStore } from "@/stores/flow-store";
import { useUiStore } from "@/stores/ui-store";

export function StepDetailPanel() {
  const { isStepPanelOpen, selectedStepId, closeStepPanel, openStepPanel } =
    useUiStore();

  const currentFlow = useFlowStore((state) => state.currentFlow);

  const steps = useMemo(
    () => [...(currentFlow?.steps ?? [])].sort((a, b) => a.order - b.order),
    [currentFlow?.steps],
  );

  const currentIndex = steps.findIndex((step) => step.id === selectedStepId);

  const currentStep = steps[currentIndex];

  const isFirstStep = currentIndex <= 0;
  const isLastStep = currentIndex >= steps.length - 1;

  const navigate = (offset: number) => {
    const nextStep = steps[currentIndex + offset];

    if (nextStep) {
      openStepPanel(nextStep.id);
    }
  };

  if (!currentStep || !selectedStepId) {
    return null;
  }

  return (
    <Sheet
      open={isStepPanelOpen}
      onOpenChange={(open) => !open && closeStepPanel()}
    >
      <SheetContent
        side="right"
        className="
          w-full
          border-l
          border-border
          bg-card/95
          backdrop-blur-xl
          p-0
          sm:max-w-md
        "
      >
        <div className="flex h-full flex-col pt-4">
          <SheetHeader className="border-b border-border px-6 py-5">
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={isFirstStep}
                onClick={() => navigate(-1)}
                className="
                  rounded-full
                  text-foreground
                  hover:bg-secondary
                "
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <SheetTitle
                className="
                  flex-1
                  text-center
                  text-[17px]
                  font-semibold
                  tracking-[-0.02em]
                  text-foreground
                  truncate
                "
              >
                {currentStep.title}
              </SheetTitle>

              <Button
                variant="ghost"
                size="icon-sm"
                disabled={isLastStep}
                onClick={() => navigate(1)}
                className="
                  rounded-full
                  text-foreground
                  hover:bg-secondary
                "
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <StepDetailContent step={currentStep} stepId={selectedStepId} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
