"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  FlowForm,
  type FlowFormValues,
} from "@/components/flow/flow-form";

import { useFlowStore } from "@/stores/flow-store";

import { toast } from "sonner";

export default function EditFlowPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const {
    currentFlow,
    loadFlow,
    updateFlow,
    deleteFlow,
  } = useFlowStore();

  useEffect(() => {
    if (id) {
      void loadFlow(id);
    }
  }, [id, loadFlow]);

  const handleSubmit = async (
    values: FlowFormValues
  ) => {
    await updateFlow(id, {
      title: values.title,
      description: values.description,
      date: values.date,
      steps: values.steps,
    });

    toast.success("Flujo actualizado");

    router.push(`/flows/${id}`);
  };

  const handleDelete = async () => {
    const confirmed = confirm(
      "¿Eliminar este flujo permanentemente?"
    );

    if (!confirmed) return;

    await deleteFlow(id);

    toast.success("Flujo eliminado");

    router.push("/");
  };

  if (!currentFlow) {
    return null;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1
            className="
              text-2xl
              font-semibold
              tracking-tight
              text-foreground
            "
          >
            Editar flujo
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-muted-foreground
            "
          >
            Modifica la información y los pasos
            de tu flujo de trabajo.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void handleDelete()}
          className="
            text-sm
            font-medium
            text-destructive
            transition-colors
            hover:opacity-80
          "
        >
          Eliminar
        </button>
      </div>

      <FlowForm
        initial={currentFlow}
        submitLabel="Guardar cambios"
        onSubmit={handleSubmit}
      />
    </div>
  );
}