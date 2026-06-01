"use client";

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
  const {
    isStepPanelOpen,
    selectedStepId,
    closeStepPanel,
  } = useUiStore();

  const currentFlow = useFlowStore(
    (state) => state.currentFlow
  );

  const steps = [...(currentFlow?.steps ?? [])].sort(
    (a, b) => a.order - b.order
  );

  const currentIndex = steps.findIndex(
    (step) => step.id === selectedStepId
  );

  const currentStep = steps[currentIndex];

  const navigate = (offset: number) => {
    const nextStep = steps[currentIndex + offset];

    if (nextStep) {
      useUiStore
        .getState()
        .openStepPanel(nextStep.id);
    }
  };

  return (
    <Sheet
      open={isStepPanelOpen}
      onOpenChange={(open) =>
        !open && closeStepPanel()
      }
    >
      <SheetContent
        side="right"
        className="w-full border-l border-[#e5e5e5] bg-white p-0 sm:max-w-md"
      >
        {currentStep && selectedStepId && (
          <div className="mt-4 flex h-full flex-col">
            <SheetHeader className="border-b border-[#e5e5e5] bg-[#fafafa] px-6 py-5">
              <div className="flex items-center justify-between gap-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={currentIndex <= 0}
                  onClick={() => navigate(-1)}
                  className="rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <SheetTitle className="flex-1 wrap-break-word text-center text-[17px] font-semibold tracking-[-0.02em]">
                  {currentStep.title}
                </SheetTitle>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={
                    currentIndex >= steps.length - 1
                  }
                  onClick={() => navigate(1)}
                  className="rounded-full"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </SheetHeader>

            <div className="scrollbar-thin flex-1 overflow-y-auto px-6 pt-2">
              <StepDetailContent
                step={currentStep}
                stepId={selectedStepId}
              />
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}