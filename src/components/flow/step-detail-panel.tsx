"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { StatusPill } from "@/components/ui/status-pill";
import { StepCommentItem } from "@/components/flow/step-comment-item";
import { useFlowEdit } from "@/components/flow/flow-edit-context";
import { useStepEditSession } from "@/hooks/use-step-edit-session";
import { useFlowStore } from "@/stores/flow-store";
import { useUiStore } from "@/stores/ui-store";
import { createId } from "@/utils/id";
import { formatDateTime } from "@/utils/date";
import type { FlowStep } from "@/types/flow";

function StepDetailContent({
  step,
  stepId,
}: {
  step: FlowStep;
  stepId: string;
}) {
  const flowEdit = useFlowEdit();
  const currentFlow = useFlowStore((s) => s.currentFlow);
  const updateStep = useFlowStore((s) => s.updateStepLocal);
  const setStepStatus = useFlowStore((s) => s.setStepStatus);
  const addComment = useFlowStore((s) => s.addComment);
  const deleteComment = useFlowStore((s) => s.deleteComment);

  const [comment, setComment] = useState("");
  const [observations, setObservations] = useState(step.observations);

  const { hasChanges, discardChanges, saveManually } = useStepEditSession({
    stepId,
    flow: currentFlow,
    localObservations: observations,
    syncBaselineNow: flowEdit.syncBaselineNow,
    markDiscarding: flowEdit.markDiscarding,
    clearDiscarding: flowEdit.clearDiscarding,
  });

  useEffect(() => {
    setObservations(step.observations);
    setComment("");
  }, [step.id, step.observations, step.updatedAt]);

  const toggleChecklist = (itemId: string) => {
    const checklist = step.checklist.map((c) =>
      c.id === itemId ? { ...c, checked: !c.checked } : c
    );
    void updateStep(step.id, { checklist });
  };

  const addChecklistItem = () => {
    void updateStep(step.id, {
      checklist: [
        ...step.checklist,
        { id: createId("chk"), label: "Nueva tarea", checked: false },
      ],
    });
  };

  const saveComment = () => {
    if (!comment.trim()) return;
    void addComment(step.id, comment.trim());
    setComment("");
  };

  const handleSave = () => {
    void saveManually({ stepId: step.id, observations });
  };

  const handleDiscard = () => {
    void discardChanges();
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between gap-3">
        <StatusPill status={step.status} />
        <span className="text-[12px] text-[#737373]">
          {formatDateTime(step.updatedAt)}
        </span>
      </div>

      {step.description && (
        <p className="text-[15px] leading-relaxed text-[#737373] line-clamp-3 wrap-break-word">
          {step.description}
        </p>
      )}

      <div>
        <h4 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-[#404040]">
          Checklist
        </h4>
        <div className="space-y-2">
          {step.checklist.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] px-3 py-2.5"
            >
              <Checkbox
                checked={item.checked}
                onCheckedChange={() => toggleChecklist(item.id)}
              />
              <span
                className={
                  item.checked
                    ? "text-[14px] text-[#737373] line-through"
                    : "text-[14px] text-foreground"
                }
              >
                {item.label}
              </span>
            </label>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={addChecklistItem}
          className="mt-2 rounded-full text-[#0066cc]"
        >
          + Añadir ítem
        </Button>
      </div>

      <Separator />

      <div>
        <h4 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-[#404040]">
          Comentarios
        </h4>
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {step.comments.map((c) => (
              <StepCommentItem
                key={c.id}
                comment={c}
                onDelete={() => void deleteComment(step.id, c.id)}
              />
            ))}
          </AnimatePresence>
        </div>
        <div className="mt-3 space-y-2">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ej: Cliente no respondió..."
            className="min-h-20 rounded-xl border-[#e5e5e5] resize-none placeholder:text-[#737373]"
          />
          <Button
            onClick={saveComment}
            size="sm"
            disabled={!comment.trim()}
            className="rounded-full bg-[#0066cc]"
          >
            Guardar comentario
          </Button>
        </div>
      </div>

      <div>
        <Label className="text-[13px] font-medium text-[#404040]">
          Observaciones
        </Label>
        <Textarea
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          className="mt-2 min-h-18 rounded-xl border-[#e5e5e5] placeholder:text-[#737373]"
          placeholder="Notas internas del paso..."
        />
      </div>

      {step.files.length > 0 && (
        <div>
          <h4 className="mb-2 text-[13px] font-semibold text-[#737373]">
            Archivos (simulados)
          </h4>
          {step.files.map((f) => (
            <p key={f.id} className="text-[13px] text-[#404040]">
              {f.name}
            </p>
          ))}
        </div>
      )}

      <Separator />

      {/* Fixed action row — no dynamic badges above (zero layout shift) */}
      <div className="flex flex-wrap items-center gap-2 border-t border-[#e5e5e5] pt-4">
        <Button
          size="sm"
          onClick={handleSave}
          className="rounded-full bg-[#0066cc] px-5 hover:bg-[#0055b3]"
        >
          Guardar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDiscard}
          disabled={!hasChanges}
          className="rounded-full border-[#e5e5e5] text-[#737373] hover:text-[#404040] disabled:opacity-40"
        >
          Descartar
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-[#e5e5e5]"
          onClick={() => void setStepStatus(step.id, "completed")}
        >
          <Check className="mr-1.5 h-4 w-4" />
          Marcar completo
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-[#ff9500]/40 text-[#c93400]"
          onClick={() => void setStepStatus(step.id, "incomplete")}
        >
          Marcar incompleto
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full text-[#737373]"
          onClick={() => void setStepStatus(step.id, "in_progress")}
        >
          En proceso
        </Button>
      </div>
    </div>
  );
}

export function StepDetailPanel() {
  const { isStepPanelOpen, selectedStepId, closeStepPanel } = useUiStore();
  const currentFlow = useFlowStore((s) => s.currentFlow);
  const steps = currentFlow?.steps ?? [];
  const sorted = [...steps].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((s) => s.id === selectedStepId);
  const step = sorted[index];

  const go = (delta: number) => {
    const next = sorted[index + delta];
    if (next) useUiStore.getState().openStepPanel(next.id);
  };

  return (
    <Sheet open={isStepPanelOpen} onOpenChange={(o) => !o && closeStepPanel()}>
      <SheetContent
        side="right"
        className="w-full border-l border-[#e5e5e5] bg-white p-0 sm:max-w-md"
      >
        {step && selectedStepId && (
          <div className="flex h-full flex-col mt-4">
            <SheetHeader className="border-b border-[#e5e5e5] bg-[#fafafa] px-6 py-5">
              <div className="flex items-center justify-between gap-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={index <= 0}
                  onClick={() => go(-1)}
                  className="rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <SheetTitle className="flex-1 line-clamp-2 wrap-break-word text-center text-[17px] font-semibold tracking-[-0.02em]">
                  {step.title}
                </SheetTitle>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={index >= sorted.length - 1}
                  onClick={() => go(1)}
                  className="rounded-full"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-6 pt-2">
              <StepDetailContent step={step} stepId={selectedStepId} />
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
