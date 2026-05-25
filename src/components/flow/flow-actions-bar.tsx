"use client";

import Link from "next/link";
import { Download, Pencil, Play } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { pdfExportService } from "@/services/pdf-export.service";
import type { Flow } from "@/types/flow";
import { useFlowStore } from "@/stores/flow-store";
import { useUiStore } from "@/stores/ui-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function FlowActionsBar({ flow }: { flow: Flow }) {
  const startGuided = useFlowStore((s) => s.startGuided);
  const setGuidedOverlayOpen = useUiStore((s) => s.setGuidedOverlayOpen);

  const handleStart = async () => {
    await startGuided();
    setGuidedOverlayOpen(true);
  };

  const handleExport = async () => {
    try {
      await pdfExportService.downloadFlow(flow);
      toast.success("PDF exportado");
    } catch {
      toast.error("No se pudo exportar el PDF");
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() => void handleStart()}
        className="rounded-full bg-primary px-5 hover:bg-[#0055b3] active:scale-[0.98]"
      >
        <Play className="mr-2 h-4 w-4" />
        Iniciar flujo
      </Button>
      <Button
        variant="outline"
        onClick={() => void handleExport()}
        className="rounded-full border-[#e5e5e5] bg-white text-foreground hover:bg-[#fafafa]"
      >
        <Download className="mr-2 h-4 w-4" />
        Exportar PDF
      </Button>
      <Link
        href={`/flows/${flow.id}/edit`}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "inline-flex rounded-full border-[#e5e5e5] bg-white hover:bg-[#fafafa]"
        )}
      >
        <Pencil className="mr-2 h-4 w-4" />
        Editar flujo
      </Link>
    </div>
  );
}
