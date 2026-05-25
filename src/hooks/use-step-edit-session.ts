"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Flow, FlowStep } from "@/types/flow";
import { useFlowStore } from "@/stores/flow-store";
import { flowSnapshot } from "@/utils/flow-snapshot";
import { cloneFlow } from "@/utils/clone-flow";
import { showManualSaveToast } from "@/utils/save-toast";

interface UseStepEditSessionOptions {
  stepId: string;
  flow: Flow | null;
  /** Local observations draft (may differ from store until Guardar) */
  localObservations?: string;
  syncBaselineNow: (flow: Flow) => void;
  markDiscarding: () => void;
  clearDiscarding: () => void;
}

/**
 * Freezes flow state when a step panel opens.
 * Discard restores that exact snapshot.
 */
export function useStepEditSession({
  stepId,
  flow,
  localObservations,
  syncBaselineNow,
  markDiscarding,
  clearDiscarding,
}: UseStepEditSessionOptions) {
  const discardToSaved = useFlowStore((s) => s.discardToSaved);
  const updateStep = useFlowStore((s) => s.updateStepLocal);

  const entryFlowRef = useRef<Flow | null>(null);
  const snapshottedStepRef = useRef<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Reset snapshot target when switching steps
  useEffect(() => {
    snapshottedStepRef.current = null;
  }, [stepId]);

  // Freeze flow at step open (once per step, when flow is available)
  useEffect(() => {
    if (!flow || snapshottedStepRef.current === stepId) return;
    entryFlowRef.current = cloneFlow(flow);
    snapshottedStepRef.current = stepId;
    setHasChanges(false);
  }, [stepId, flow]);

  // Track dirty vs entry snapshot (flow + local observations draft)
  useEffect(() => {
    if (!flow || !entryFlowRef.current) {
      setHasChanges(false);
      return;
    }

    const flowDirty =
      flowSnapshot(flow) !== flowSnapshot(entryFlowRef.current);

    const entryStep = entryFlowRef.current.steps.find((s) => s.id === stepId);
    const entryObs = entryStep?.observations ?? "";
    const obsDirty =
      localObservations !== undefined && localObservations !== entryObs;

    setHasChanges(flowDirty || obsDirty);
  }, [flow, stepId, localObservations]);

  const discardChanges = useCallback(async () => {
    const entry = entryFlowRef.current;
    if (!entry) return;

    markDiscarding();
    await discardToSaved(entry);
    setHasChanges(false);
    syncBaselineNow(entry);
    clearDiscarding();
  }, [discardToSaved, markDiscarding, clearDiscarding, syncBaselineNow]);

  const saveManually = useCallback(
    async (pending?: { stepId: string; observations?: string }) => {
      if (!flow) return;

      if (
        pending?.observations !== undefined &&
        pending.observations !==
          flow.steps.find((s) => s.id === pending.stepId)?.observations
      ) {
        await updateStep(pending.stepId, {
          observations: pending.observations,
        });
      }

      const latest = useFlowStore.getState().currentFlow ?? flow;
      entryFlowRef.current = cloneFlow(latest);
      syncBaselineNow(latest);
      setHasChanges(false);
      showManualSaveToast();
    },
    [flow, updateStep, syncBaselineNow]
  );

  const getEntryStep = useCallback((): FlowStep | undefined => {
    return entryFlowRef.current?.steps.find((s) => s.id === stepId);
  }, [stepId]);

  return {
    hasChanges,
    discardChanges,
    saveManually,
    getEntryStep,
  };
}
