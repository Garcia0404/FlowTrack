"use client";

import { createContext, useContext } from "react";
import type { Flow } from "@/types/flow";

export interface FlowEditContextValue {
  hasUnsavedChanges: boolean;
  syncBaselineNow: (flow: Flow) => void;
  markDiscarding: () => void;
  clearDiscarding: () => void;
}

const FlowEditContext = createContext<FlowEditContextValue | null>(null);

export function FlowEditProvider({
  value,
  children,
}: {
  value: FlowEditContextValue;
  children: React.ReactNode;
}) {
  return (
    <FlowEditContext.Provider value={value}>{children}</FlowEditContext.Provider>
  );
}

export function useFlowEdit() {
  const ctx = useContext(FlowEditContext);
  if (!ctx) {
    throw new Error("useFlowEdit must be used within FlowEditProvider");
  }
  return ctx;
}
