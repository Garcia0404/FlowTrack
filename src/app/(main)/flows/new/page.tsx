"use client";

import { useRouter } from "next/navigation";
import { FlowForm, type FlowFormValues } from "@/components/flow/flow-form";
import { useFlowStore } from "@/stores/flow-store";
import { toast } from "sonner";

export default function NewFlowPage() {
  const router = useRouter();
  const createFlow = useFlowStore((s) => s.createFlow);

  const handleSubmit = async (values: FlowFormValues) => {
    const flow = await createFlow({
      title: values.title,
      description: values.description,
      date: values.date,
      steps: values.steps,
    });
    toast.success("Flujo creado");
    router.push(`/flows/${flow.id}`);
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-[-0.03em]">
        Nuevo flujo
      </h1>
      <FlowForm submitLabel="Crear flujo" onSubmit={handleSubmit} />
    </div>
  );
}
