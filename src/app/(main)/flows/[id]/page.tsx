"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FlowProgressHeader } from "@/components/flow/flow-progress-header";
import { FlowActionsBar } from "@/components/flow/flow-actions-bar";
import { FlowEditProvider } from "@/components/flow/flow-edit-context";
import { VerticalTimeline } from "@/components/timeline/vertical-timeline";
import { StepDetailPanel } from "@/components/flow/step-detail/step-detail-panel";
import { GuidedFlowOverlay } from "@/components/flow/guided-flow-overlay";
import { useFlowStore } from "@/stores/flow-store";
import { useFlowAutosave } from "@/hooks/use-flow-autosave";

export default function FlowDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { currentFlow, loadFlow, isLoading } = useFlowStore();
  const editSession = useFlowAutosave(currentFlow, id);

  useEffect(() => {
    if (id) void loadFlow(id);
  }, [id, loadFlow]);

  if (isLoading && !currentFlow) {
    return (
      <div className="h-64 animate-pulse rounded-3xl border border-[#e5e5e5] bg-white" />
    );
  }

  if (!currentFlow) {
    return (
      <p className="text-foreground/70">
        Flujo no encontrado.{" "}
        <button
          type="button"
          className="font-medium text-primary"
          onClick={() => router.push("/")}
        >
          Volver
        </button>
      </p>
    );
  }

  return (
    <FlowEditProvider value={editSession}>
      <div>
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
