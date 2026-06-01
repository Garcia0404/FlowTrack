"use client";

import { useEffect, useState } from "react";
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

  const { currentFlow, loadFlow, isLoading } = useFlowStore();

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!id) return;

    void loadFlow(id).finally(() => {
      setInitialized(true);
    });
  }, [id, loadFlow]);

  const editSession = useFlowAutosave(currentFlow, id);

  if (!initialized || isLoading) {
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
          onClick={() => router.push("/")}
          className="font-medium text-primary"
        >
          Volver
        </button>
      </p>
    );
  }

  return (
    <FlowEditProvider value={editSession}>
      <div>
        <div className="animate-in fade-in duration-300">
          <FlowProgressHeader flow={currentFlow} />
        </div>

        <div className="mt-6 animate-in fade-in duration-600">
          <FlowActionsBar flow={currentFlow} />
        </div>

        <VerticalTimeline flow={currentFlow} />

        <StepDetailPanel />

        <GuidedFlowOverlay />
      </div>
    </FlowEditProvider>
  );
}