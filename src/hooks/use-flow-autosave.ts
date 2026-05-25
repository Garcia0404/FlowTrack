"use client";

import { useEffect, useRef, useState } from "react";
import type { Flow } from "@/types/flow";
import { flowSnapshot } from "@/utils/flow-snapshot";
import { cloneFlow } from "@/utils/clone-flow";

const SAVE_DEBOUNCE_MS = 800;

/**
 * Silent autosave session at flow level.
 * Persists via store on each change; debounce only syncs internal baseline — no UI.
 */
export function useFlowAutosave(flow: Flow | null, flowId: string) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const lastSavedFlowRef = useRef<Flow | null>(null);
  const baselineRef = useRef<string | null>(null);
  const initializedRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDiscardingRef = useRef(false);

  useEffect(() => {
    initializedRef.current = false;
    baselineRef.current = null;
    lastSavedFlowRef.current = null;
    isDiscardingRef.current = false;
    setHasUnsavedChanges(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, [flowId]);

  useEffect(() => {
    if (!flow || flow.id !== flowId) return;
    if (isDiscardingRef.current) return;

    const snapshot = flowSnapshot(flow);

    if (!initializedRef.current) {
      baselineRef.current = snapshot;
      lastSavedFlowRef.current = cloneFlow(flow);
      initializedRef.current = true;
      setHasUnsavedChanges(false);
      return;
    }

    if (baselineRef.current === snapshot) {
      return;
    }

    setHasUnsavedChanges(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      baselineRef.current = snapshot;
      lastSavedFlowRef.current = cloneFlow(flow);
      setHasUnsavedChanges(false);
      debounceRef.current = null;
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [flow, flowId]);

  const syncBaselineNow = (f: Flow) => {
    const snapshot = flowSnapshot(f);
    baselineRef.current = snapshot;
    lastSavedFlowRef.current = cloneFlow(f);
    setHasUnsavedChanges(false);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  };

  const markDiscarding = () => {
    isDiscardingRef.current = true;
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  };

  const clearDiscarding = () => {
    requestAnimationFrame(() => {
      isDiscardingRef.current = false;
    });
  };

  return {
    hasUnsavedChanges,
    syncBaselineNow,
    markDiscarding,
    clearDiscarding,
  };
}
