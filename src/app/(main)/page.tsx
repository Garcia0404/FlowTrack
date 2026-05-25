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
  const { flows, loadFlows, isLoading } = useFlowStore();

  useEffect(() => {
    void (async () => {
      await seedDemoFlowIfEmpty();
      await loadFlows();
    })();
  }, [loadFlows]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Tus flujos
        </h1>
        <p className="mt-1 text-sm text-foreground/70">
          Timeline vertical, progreso en tiempo real y exportación PDF.
        </p>
      </div>

      {isLoading && flows.length === 0 ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl border border-[#e5e5e5] bg-white"
            />
          ))}
        </div>
      ) : flows.length === 0 ? (
        <EmptyState
          icon={Workflow}
          title="Sin flujos todavía"
          description="Crea tu primer flujo de trabajo y organízalo paso a paso con comentarios y checklist."
          actionLabel="Crear flujo"
          onAction={() => router.push("/flows/new")}
        />
      ) : (
        <div className="space-y-3">
          {flows.map((flow, i) => (
            <FlowCard key={flow.id} flow={flow} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
