"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Workflow } from "lucide-react";

import { FlowCard } from "@/components/flow/flow-card";
import { EmptyState } from "@/components/ui/empty-state";

import { useFlowStore } from "@/stores/flow-store";
import { seedDemoFlowIfEmpty } from "@/lib/seed-data";

export default function DashboardPage() {
  const router = useRouter();

  const {
    flows,
    loadFlows,
    isLoading,
  } = useFlowStore();

  useEffect(() => {
    void (async () => {
      await seedDemoFlowIfEmpty();
      await loadFlows();
    })();
  }, [loadFlows]);

  return (
    <div className="animate-in fade-in duration-300">
      <section className="mb-12 animate-in slide-in-from-bottom-2 fade-in duration-500">
        <h1 className="text-[34px] font-semibold tracking-[-0.03em] text-foreground">
          Tus flujos
        </h1>

        <p className="mt-2 max-w-2xl text-[17px] leading-[1.47] text-muted-foreground">
          Timeline vertical, progreso en tiempo real
          y exportación PDF.
        </p>
      </section>

      {isLoading && flows.length === 0 ? (
        <div className="animate-in fade-in duration-300">
          <p className="text-sm text-muted-foreground">
            Cargando flujos...
          </p>
        </div>
      ) : flows.length === 0 ? (
        <div className="animate-in zoom-in-95 fade-in duration-300">
          <EmptyState
            icon={Workflow}
            title="Sin flujos todavía"
            description="Crea tu primer flujo de trabajo y organízalo paso a paso con comentarios y checklist."
            actionLabel="Crear flujo"
            onAction={() =>
              router.push("/flows/new")
            }
          />
        </div>
      ) : (
        <div className="space-y-4">
          {flows.map((flow, index) => (
            <div
              key={flow.id}
              className="animate-in slide-in-from-bottom-2 fade-in"
              style={{
                animationDuration: "400ms",
                animationDelay: `${index * 60}ms`,
                animationFillMode: "both",
              }}
            >
              <FlowCard flow={flow} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}