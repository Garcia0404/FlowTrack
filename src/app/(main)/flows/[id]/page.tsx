"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { FlowProgressHeader } from "@/components/flow/flow-progress-header";
import { FlowActionsBar } from "@/components/flow/flow-actions-bar";
import { FlowEditProvider } from "@/components/flow/flow-edit-context";
import { GuidedFlowOverlay } from "@/components/flow/guided-flow-overlay";
import { StepDetailPanel } from "@/components/flow/step-detail/step-detail-panel";
import { VerticalTimeline } from "@/components/timeline/vertical-timeline";

import { useFlowStore } from "@/stores/flow-store";
import { useFlowAutosave } from "@/hooks/use-flow-autosave";

export default function FlowDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const {
    currentFlow,
    loadFlow,
    isLoading,
  } = useFlowStore();

  useEffect(() => {
    if (!id) return;

    void loadFlow(id);
  }, [id, loadFlow]);

  const editSession = useFlowAutosave(
    currentFlow,
    id
  );

  if (isLoading || !currentFlow) {
    return null;
  }

  return (
    <FlowEditProvider value={editSession}>
      <div className="animate-in fade-in duration-500">
        <FlowProgressHeader flow={currentFlow} />

        <div className="mt-6">
          <FlowActionsBar flow={currentFlow} />
        </div>

        <VerticalTimeline flow={currentFlow} />

        <StepDetailPanel />

        <GuidedFlowOverlay />
      </div>
    </FlowEditProvider>
  );
}