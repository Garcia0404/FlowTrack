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
          { id: createId("chk"), label: "Dirección origen", checked: true },
          { id: createId("chk"), label: "Dirección destino", checked: true },
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
          { id: createId("chk"), label: "Conductor asignado", checked: true },
          { id: createId("chk"), label: "Vehículo verificado", checked: false },
        ],
        observations: "Pendiente confirmar placa",
      }),
      buildStep({
        title: "Entrega final",
        description: "Cierre de servicio y evidencia de entrega.",
        status: "pending",
        order: 2,
        checklist: [
          { id: createId("chk"), label: "Firma digital", checked: false },
          { id: createId("chk"), label: "Foto de entrega", checked: false },
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
