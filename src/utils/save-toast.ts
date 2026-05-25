import { toast } from "sonner";

const TOAST_ID = "flowtrack-manual-save";

/** Floating toast — no layout shift in the page */
export function showManualSaveToast(): void {
  toast.success("Guardado", {
    id: TOAST_ID,
    description: "Cambios sincronizados localmente",
    duration: 2200,
    position: "bottom-center",
  });
}
