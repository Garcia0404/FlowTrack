"use client";

import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";

import { useFlowEdit } from "@/components/flow/flow-edit-context";
import { useStepEditSession } from "@/hooks/use-step-edit-session";

import { StepHeader } from "@/components/flow/step-detail/step-header";
import { StepChecklistSection } from "@/components/flow/step-detail/step-checklist-section";
import { StepCommentsSection } from "@/components/flow/step-detail/step-comments-section";
import { StepObservationsSection } from "@/components/flow/step-detail/step-observations-section";
import { StepSaveActions } from "@/components/flow/step-detail/step-save-actions";
import { StepStatusActions } from "@/components/flow/step-detail/step-status-actions";
import { StepFilesSection } from "@/components/flow/step-detail/step-files-section";

import { useFlowStore } from "@/stores/flow-store";

import { createId } from "@/utils/id";

import type { FlowStep } from "@/types/flow";
import { useUiStore } from "@/stores/ui-store";

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

    const [comment, setComment] = useState("");
    const [observations, setObservations] = useState(step.observations);

    const { hasChanges, discardChanges, saveManually } =
        useStepEditSession({
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

    const saveComment = () => {
        const text = comment.trim();

        if (!text) return;

        void addComment(step.id, text);
        setComment("");
    };

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
                <p className="text-[15px] leading-relaxed text-[#737373] line-clamp-3 wrap-break-word">
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