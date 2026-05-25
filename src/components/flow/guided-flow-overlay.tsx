"use client";

import { motion, AnimatePresence } from "framer-motion";
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
import { useState } from "react";

export function GuidedFlowOverlay() {
  const currentFlow = useFlowStore((s) => s.currentFlow);
  const {
    completeGuidedStep,
    setStepStatus,
    addComment,
    goToGuidedStep,
    stopGuided,
  } = useFlowStore();
  const { isGuidedOverlayOpen, setGuidedOverlayOpen } = useUiStore();
  const [comment, setComment] = useState("");

  if (!currentFlow?.isGuidedActive || currentFlow.guidedStepIndex === null) {
    return null;
  }

  const steps = [...currentFlow.steps].sort((a, b) => a.order - b.order);
  const index = currentFlow.guidedStepIndex;
  const step = steps[index];
  if (!step) return null;

  const close = async () => {
    await stopGuided();
    setGuidedOverlayOpen(false);
  };

  const handleNext = async () => {
    await completeGuidedStep(true);
    setComment("");
  };

  const handleIncomplete = async () => {
    await setStepStatus(step.id, "incomplete");
    if (comment.trim()) await addComment(step.id, comment.trim());
    await completeGuidedStep(true);
    setComment("");
  };

  const handleComplete = async () => {
    await setStepStatus(step.id, "completed");
    if (comment.trim()) await addComment(step.id, comment.trim());
    await completeGuidedStep(true);
    setComment("");
  };

  const open = isGuidedOverlayOpen && currentFlow.isGuidedActive;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            className="w-full max-w-lg rounded-3xl border border-[#e5e5e5] bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[13px] font-medium text-[#0066cc]">
                  Paso {index + 1} de {steps.length}
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em]">
                  {step.title}
                </h2>
                <StatusPill status={step.status} className="mt-2" />
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => void close()}
                className="rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {step.description && (
              <p className="mt-4 text-[15px] leading-relaxed text-[#737373]">
                {step.description}
              </p>
            )}

            <div className="mt-4 space-y-2">
              {step.checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 text-[14px] text-[#404040]"
                >
                  <span>{item.checked ? "✓" : "○"}</span>
                  {item.label}
                </div>
              ))}
            </div>

            <Textarea
              className="mt-4 min-h-18 rounded-xl"
              placeholder="Comentario rápido..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="mt-6 flex flex-wrap gap-2">
              <Button
                variant="outline"
                disabled={index <= 0}
                onClick={() => void goToGuidedStep(index - 1)}
                className="rounded-full"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Anterior
              </Button>
              <Button
                onClick={() => void handleComplete()}
                className="rounded-full bg-[#34c759] hover:bg-[#2db84c] text-white"
              >
                <Check className="mr-1 h-4 w-4" />
                Completo
              </Button>
              <Button
                variant="outline"
                onClick={() => void handleIncomplete()}
                className="rounded-full border-[#ff9500]/40"
              >
                <AlertCircle className="mr-1 h-4 w-4 text-[#ff9500]" />
                Incompleto
              </Button>
              <Button
                onClick={() => void handleNext()}
                className="rounded-full bg-[#0066cc] ml-auto"
              >
                Siguiente
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
