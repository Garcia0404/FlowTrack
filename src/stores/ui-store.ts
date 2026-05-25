import { create } from "zustand";

interface UiState {
  selectedStepId: string | null;
  isStepPanelOpen: boolean;
  isGuidedOverlayOpen: boolean;
  openStepPanel: (stepId: string) => void;
  closeStepPanel: () => void;
  setGuidedOverlayOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  selectedStepId: null,
  isStepPanelOpen: false,
  isGuidedOverlayOpen: false,

  openStepPanel: (stepId) =>
    set({ selectedStepId: stepId, isStepPanelOpen: true }),

  closeStepPanel: () =>
    set({ selectedStepId: null, isStepPanelOpen: false }),

  setGuidedOverlayOpen: (open) => set({ isGuidedOverlayOpen: open }),
}));
