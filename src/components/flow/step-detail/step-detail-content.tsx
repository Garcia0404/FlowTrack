"use client";

import { useEffect, useState } from "react";

import { Separator } from "@/components/ui/separator";

import { useFlowEdit } from "@/components/flow/flow-edit-context";

import { StepHeader } from "@/components/flow/step-detail/step-header";
import { StepChecklistSection } from "@/components/flow/step-detail/step-checklist-section";
import { StepCommentsSection } from "@/components/flow/step-detail/step-comments-section";
import { StepObservationsSection } from "@/components/flow/step-detail/step-observations-section";
import { StepSaveActions } from "@/components/flow/step-detail/step-save-actions";
import { StepStatusActions } from "@/components/flow/step-detail/step-status-actions";
import { StepFilesSection } from "@/components/flow/step-detail/step-files-section";

import { useStepEditSession } from "@/hooks/use-step-edit-session";
import { useStepChecklist } from "@/hooks/use-step-checklist";
import { useStepComments } from "@/hooks/use-step-comments";

import { useFlowStore } from "@/stores/flow-store";
import { useUiStore } from "@/stores/ui-store";

import type { FlowStep } from "@/types/flow";

interface StepDetailContentProps {
  step: FlowStep;
  stepId: string;
}

export function StepDetailContent({
  step,
  stepId,
}: StepDetailContentProps) {
  const flowEdit = useFlowEdit();

  const currentFlow = useFlowStore((s) => s.currentFlow);
  const updateStep = useFlowStore((s) => s.updateStepLocal);
  const setStepStatus = useFlowStore((s) => s.setStepStatus);
  const addComment = useFlowStore((s) => s.addComment);
  const deleteComment = useFlowStore((s) => s.deleteComment);

  const { closeStepPanel } = useUiStore();

  const [observations, setObservations] = useState(
    step.observations
  );

  const {
    hasChanges,
    discardChanges,
    saveManually,
  } = useStepEditSession({
    stepId,
    flow: currentFlow,
    localObservations: observations,
    syncBaselineNow: flowEdit.syncBaselineNow,
    markDiscarding: flowEdit.markDiscarding,
    clearDiscarding: flowEdit.clearDiscarding,
  });

  const {
    comment,
    setComment,
    saveComment,
  } = useStepComments({
    stepId: step.id,
    addComment,
  });

  const {
    toggleChecklist,
    updateChecklistItem,
    deleteChecklistItem,
    addChecklistItem,
  } = useStepChecklist({
    step,
    updateStep,
  });

  useEffect(() => {
    setObservations(step.observations);
    setComment("");
  }, [
    step.id,
    step.observations,
    step.updatedAt,
    setComment,
  ]);

  const handleSave = () => {
    void saveManually({
      stepId: step.id,
      observations,
    });
  };

  const handleDiscard = () => {
    void discardChanges();
    closeStepPanel();
  };

  return (
    <div className="space-y-6 pb-8">
      <StepHeader
        status={step.status}
        updatedAt={step.updatedAt}
      />

      {step.description && (
        <p className="text-sm leading-relaxed text-[#737373] line-clamp-3 wrap-break-word text-pretty">
          {step.description}
        </p>
      )}

      <StepChecklistSection
        checklist={step.checklist}
        onToggle={toggleChecklist}
        onUpdate={updateChecklistItem}
        onDelete={deleteChecklistItem}
        onAdd={addChecklistItem}
      />

      <Separator />

      <StepCommentsSection
        comments={step.comments}
        value={comment}
        onChange={setComment}
        onSave={saveComment}
        onDelete={(commentId) =>
          void deleteComment(step.id, commentId)
        }
      />

      <StepObservationsSection
        value={observations}
        onChange={setObservations}
      />

      <StepFilesSection files={step.files} />

      <Separator />

      <StepSaveActions
        hasChanges={hasChanges}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />

      <StepStatusActions
        stepId={step.id}
        setStepStatus={setStepStatus}
      />
    </div>
  );
}