"use client";

import Link from "next/link";
import {
  Download,
  Pencil,
  Play,
} from "lucide-react";

import {
  Button,
  buttonVariants,
} from "@/components/ui/button";

import { pdfExportService } from "@/services/pdf-export.service";

import type { Flow } from "@/types/flow";

import { useFlowStore } from "@/stores/flow-store";
import { useUiStore } from "@/stores/ui-store";

import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function FlowActionsBar({
  flow,
}: {
  flow: Flow;
}) {
  const startGuided =
    useFlowStore(
      (s) => s.startGuided
    );

  const setGuidedOverlayOpen =
    useUiStore(
      (s) =>
        s.setGuidedOverlayOpen
    );

  const handleStart = () => {
  setGuidedOverlayOpen(true);

  void startGuided();
};

  const handleExport =
    async () => {
      try {
        await pdfExportService.downloadFlow(
          flow
        );

        toast.success(
          "PDF exportado"
        );
      } catch {
        toast.error(
          "No se pudo exportar el PDF"
        );
      }
    };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        onClick={() =>
          void handleStart()
        }
        className="h-11 rounded-full px-5"
      >
        <Play className="mr-2 h-4 w-4 fill-current" />
        Iniciar flujo
      </Button>

      <Button
        variant="outline"
        onClick={() =>
          void handleExport()
        }
        className="
          h-11
          rounded-full
          border-border
          bg-background
          px-5
          text-foreground
          hover:bg-accent
        "
      >
        <Download className="mr-2 h-4 w-4" />
        Exportar PDF
      </Button>

      <Link
        href={`/flows/${flow.id}/edit`}
        className={cn(
          buttonVariants({
            variant: "outline",
          }),
          `
          h-11
          rounded-full
          border-border
          bg-background
          px-5
          text-foreground
          hover:bg-accent
        `
        )}
      >
        <Pencil className="mr-2 h-4 w-4" />
        Editar flujo
      </Link>
    </div>
  );
}