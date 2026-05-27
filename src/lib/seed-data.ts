import { getFlowRepository } from "@/lib/repository-factory";
import type { Flow, FlowStep } from "@/types/flow";
import { createId } from "@/utils/id";
import { nowIso } from "@/utils/date";

function buildStep(
  partial: Pick<FlowStep, "title" | "description" | "status" | "order"> &
    Partial<
      Pick<
        FlowStep,
        "checklist" | "comments" | "observations" | "files"
      >
    >
): FlowStep {
  const ts = nowIso();
  return {
    id: createId("step"),
    title: partial.title,
    description: partial.description,
    status: partial.status,
    checklist: partial.checklist ?? [],
    comments: partial.comments ?? [],
    observations: partial.observations ?? "",
    files: partial.files ?? [],
    order: partial.order,
    createdAt: ts,
    updatedAt: ts,
  };
}

export async function seedDemoFlowIfEmpty(): Promise<void> {
  const repo = getFlowRepository();
  const existing = await repo.findAll();
  if (existing.length > 0) return;

  const ts = nowIso();
  const flow: Flow = {
    id: createId("flow"),
    title: "Servicio de Transporte",
    description:
      "Flujo operativo para coordinar recogida, tránsito y entrega con seguimiento por pasos.",
    date: ts,
    status: "active",
    steps: [
      buildStep({
        title: "Confirmar dirección",
        description: "Validar origen y destino con el cliente.",
        status: "completed",
        order: 0,
        checklist: [
          { id: createId("chk"), text: "Dirección origen", completed: true },
          { id: createId("chk"), text: "Dirección destino", completed: true },
        ],
        comments: [
          {
            id: createId("comment"),
            text: "Cliente confirmó por WhatsApp",
            createdAt: ts,
          },
        ],
      }),
      buildStep({
        title: "Asignar conductor",
        description: "Seleccionar unidad disponible y notificar.",
        status: "in_progress",
        order: 1,
        checklist: [
          { id: createId("chk"), text: "Conductor asignado", completed: true },
          { id: createId("chk"), text: "Vehículo verificado", completed: false },
        ],
        observations: "Pendiente confirmar placa",
      }),
      buildStep({
        title: "Entrega final",
        description: "Cierre de servicio y evidencia de entrega.",
        status: "pending",
        order: 2,
        checklist: [
          { id: createId("chk"), text: "Firma digital", completed: false },
          { id: createId("chk"), text: "Foto de entrega", completed: false },
        ],
        comments: [
          {
            id: createId("comment"),
            text: "Documento pendiente de firma",
            createdAt: ts,
          },
        ],
        files: [
          {
            id: createId("file"),
            name: "guia-transporte.pdf",
            size: 245000,
            uploadedAt: ts,
          },
        ],
      }),
    ],
    guidedStepIndex: null,
    isGuidedActive: false,
    createdAt: ts,
    updatedAt: ts,
  };

  await repo.saveAll([flow]);
}
