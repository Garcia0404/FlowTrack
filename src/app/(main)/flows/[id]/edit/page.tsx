"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FlowForm, type FlowFormValues } from "@/components/flow/flow-form";
import { useFlowStore } from "@/stores/flow-store";
import { toast } from "sonner";

export default function EditFlowPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { currentFlow, loadFlow, updateFlow, deleteFlow } = useFlowStore();

  useEffect(() => {
    if (id) void loadFlow(id);
  }, [id, loadFlow]);

  const handleSubmit = async (values: FlowFormValues) => {
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
    if (!confirm("¿Eliminar este flujo permanentemente?")) return;
    await deleteFlow(id);
    toast.success("Flujo eliminado");
    router.push("/");
  };

  if (!currentFlow) {
    return (
      <div className="h-48 animate-pulse rounded-2xl border border-[#e5e5e5] bg-white" />
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-[-0.03em]">
          Editar flujo
        </h1>
        <button
          type="button"
          onClick={() => void handleDelete()}
          className="text-[13px] text-red-600 hover:underline"
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
