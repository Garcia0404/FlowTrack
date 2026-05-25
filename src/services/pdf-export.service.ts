import { STEP_STATUS_LABELS } from "@/constants/step-status";
import { FLOW_STATUS_LABELS } from "@/constants/flow-status";
import type { Flow } from "@/types/flow";
import { computeFlowProgress } from "@/utils/flow-progress";
import { formatDate, formatDateTime } from "@/utils/date";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const MARGIN = 56;
const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;

export class PdfExportService {
  async exportFlow(flow: Flow): Promise<Uint8Array> {
    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

    let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y = PAGE_HEIGHT - MARGIN;
    const progress = computeFlowProgress(flow);

    const drawText = (
      text: string,
      size: number,
      bold = false,
      color = rgb(0.11, 0.11, 0.12)
    ) => {
      page.drawText(text, {
        x: MARGIN,
        y,
        size,
        font: bold ? fontBold : font,
        color,
      });
      y -= size * 1.6;
    };

    const ensureSpace = (needed: number) => {
      if (y - needed < MARGIN) {
        page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        y = PAGE_HEIGHT - MARGIN;
      }
    };

    drawText(flow.title, 22, true);
    drawText(flow.description || "Sin descripción", 11, false, rgb(0.4, 0.4, 0.42));
    y -= 8;
    drawText(`Fecha: ${formatDate(flow.date)}`, 10);
    drawText(`Estado: ${FLOW_STATUS_LABELS[flow.status]}`, 10);
    drawText(`Progreso: ${progress.percent}% (${progress.completed}/${progress.total})`, 10);
    drawText(`Incompletos: ${progress.incomplete}`, 10);
    drawText(`Actualizado: ${formatDateTime(flow.updatedAt)}`, 10);
    y -= 16;

    drawText("Timeline de pasos", 14, true);
    y -= 8;

    for (const step of [...flow.steps].sort((a, b) => a.order - b.order)) {
      ensureSpace(120);
      drawText(`${step.order + 1}. ${step.title}`, 12, true);
      drawText(STEP_STATUS_LABELS[step.status], 10, false, rgb(0, 0.4, 0.8));
      if (step.description) {
        drawText(step.description.slice(0, 120), 9, false, rgb(0.35, 0.35, 0.37));
      }
      if (step.observations) {
        drawText(`Obs: ${step.observations.slice(0, 100)}`, 9);
      }
      for (const item of step.checklist) {
        ensureSpace(20);
        drawText(`${item.checked ? "✓" : "○"} ${item.label}`, 9);
      }
      for (const c of step.comments) {
        ensureSpace(24);
        drawText(`• ${c.text}`, 9, false, rgb(0.45, 0.45, 0.47));
      }
      y -= 12;
    }

    ensureSpace(60);
    y -= 8;
    drawText("Resumen", 14, true);
    drawText(
      `Flujo "${flow.title}" — ${progress.completed} completos, ${progress.incomplete} incompletos, ${progress.pending} pendientes.`,
      10
    );

    return pdf.save();
  }

  async downloadFlow(flow: Flow, filename?: string): Promise<void> {
    const bytes = await this.exportFlow(flow);
    const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename ?? `${flow.title.replace(/\s+/g, "-").toLowerCase()}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

export const pdfExportService = new PdfExportService();
