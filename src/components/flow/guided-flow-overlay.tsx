"use client";

import { useState } from "react";
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusPill } from "@/components/ui/status-pill";

import { useFlowStore } from "@/stores/flow-store";
import { useUiStore } from "@/stores/ui-store";

export function GuidedFlowOverlay() {
  const currentFlow = useFlowStore(
    (s) => s.currentFlow
  );

  const {
    completeGuidedStep,
    setStepStatus,
    addComment,
    goToGuidedStep,
    stopGuided,
  } = useFlowStore();

  const {
    isGuidedOverlayOpen,
    setGuidedOverlayOpen,
  } = useUiStore();

  const [comment, setComment] =
    useState("");

  const steps = [
    ...(currentFlow?.steps ?? []),
  ].sort((a, b) => a.order - b.order);

  const index = currentFlow?.guidedStepIndex;

  const step =
    index === null || index === undefined
      ? null
      : steps[index];

  const open =
    isGuidedOverlayOpen &&
    !!currentFlow?.isGuidedActive &&
    !!step;

  const close = async () => {
    await stopGuided();
    setGuidedOverlayOpen(false);
  };

  const handleNext = async () => {
    await completeGuidedStep(true);
    setComment("");
  };

  const handleIncomplete =
    async () => {
      if (!step) return;

      await setStepStatus(
        step.id,
        "incomplete"
      );

      if (comment.trim()) {
        await addComment(
          step.id,
          comment.trim()
        );
      }

      await completeGuidedStep(true);

      setComment("");
    };

  const handleComplete =
    async () => {
      if (!step) return;

      await setStepStatus(
        step.id,
        "completed"
      );

      if (comment.trim()) {
        await addComment(
          step.id,
          comment.trim()
        );
      }

      await completeGuidedStep(true);

      setComment("");
    };

  if (!currentFlow || !step) {
    return null;
  }

  return (
    <div
      className={`
        fixed inset-0 z-50
        flex items-end justify-center
        p-4 sm:items-center
        transition-all duration-500
        ease-[cubic-bezier(0.22,1,0.36,1)]
        ${open
          ? "opacity-100 bg-black/40 backdrop-blur-sm"
          : "pointer-events-none opacity-0 bg-black/0"
        }
      `}
    >
      <div
        className={`
          w-full max-w-lg
          rounded-3xl
          border border-border
          bg-card
          p-6
          shadow-xl
          transition-all duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]
          ${open
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-8 scale-[0.96] opacity-0"
          }
        `}
      >
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2 text-sm font-medium text-primary">
              {typeof index === "number" && (
                <span>
                  Paso {index + 1} de {steps.length}
                </span>
              )}

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() =>
                  void close()
                }
                className="rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground wrap-break-word text-balance">
              {step.title}
            </h2>

            <StatusPill
              status={step.status}
              className="mt-3"
            />
          </div>
        </div>

        {step.description && (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground wrap-break-word text-pretty">
            {step.description}
          </p>
        )}

        {step.checklist.length > 0 && (
          <div className="mt-5 space-y-2">
            {step.checklist.map(
              (item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 text-sm text-foreground"
                >
                  <span>
                    {item.checked
                      ? "✓"
                      : "○"}
                  </span>

                  <span>
                    {item.label}
                  </span>
                </div>
              )
            )}
          </div>
        )}

        <Textarea
          value={comment}
          onChange={(e) =>
            setComment(
              e.target.value
            )
          }
          placeholder="Comentario rápido..."
          className="mt-5 px-4 min-h-20 rounded-xl"
        />

        <div className="mt-6 flex flex-wrap gap-2">
          <Button
            variant="outline"
            disabled={
              typeof index !== "number" ||
              index <= 0
            }
            onClick={() =>
              typeof index === "number" &&
              void goToGuidedStep(index - 1)
            }
            className="rounded-full"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Anterior
          </Button>

          <Button
            onClick={() =>
              void handleComplete()
            }
            className="rounded-full"
          >
            <Check className="mr-1 h-4 w-4" />
            Completo
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              void handleIncomplete()
            }
            className="rounded-full"
          >
            <AlertCircle className="mr-1 h-4 w-4" />
            Incompleto
          </Button>

          <Button
            onClick={() =>
              void handleNext()
            }
            className="ml-auto rounded-full"
          >
            Siguiente
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}