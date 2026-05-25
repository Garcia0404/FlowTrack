"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Flow, FlowStep } from "@/types/flow";
import { createId } from "@/utils/id";
import { nowIso } from "@/utils/date";

export interface FlowFormValues {
  title: string;
  description: string;
  date: string;
  steps: FlowStep[];
}

function emptyStep(order: number): FlowStep {
  const ts = nowIso();
  return {
    id: createId("step"),
    title: "",
    description: "",
    status: "pending",
    checklist: [],
    comments: [],
    observations: "",
    files: [],
    order,
    createdAt: ts,
    updatedAt: ts,
  };
}

export function FlowForm({
  initial,
  onSubmit,
  submitLabel,
}: {
  initial?: Flow;
  onSubmit: (values: FlowFormValues) => Promise<void>;
  submitLabel: string;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [date, setDate] = useState(
    initial?.date?.slice(0, 10) ?? new Date().toISOString().slice(0, 10)
  );
  const [steps, setSteps] = useState<FlowStep[]>(
    initial?.steps?.length
      ? [...initial.steps].sort((a, b) => a.order - b.order)
      : [emptyStep(0)]
  );
  const [saving, setSaving] = useState(false);

  const updateStep = (id: string, patch: Partial<FlowStep>) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
    );
  };

  const addStep = () => {
    setSteps((prev) => [...prev, emptyStep(prev.length)]);
  };

  const removeStep = (id: string) => {
    setSteps((prev) =>
      prev.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        title,
        description,
        date: new Date(date).toISOString(),
        steps: steps.map((s, i) => ({ ...s, order: i })),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-8">
      <div className="space-y-4 rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <Label>Título del flujo</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Servicio de Transporte"
            required
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label>Descripción</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-22 rounded-xl resize-none"
          />
        </div>
        <div className="space-y-2">
          <Label>Fecha</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-[-0.02em]">Pasos</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addStep}
            className="rounded-full"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Añadir paso
          </Button>
        </div>

        {steps.map((step, i) => (
          <div
            key={step.id}
            className="space-y-3 rounded-2xl border border-[#e5e5e5] bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-[#404040]">
                Paso {i + 1}
              </span>
              {steps.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeStep(step.id)}
                  className="text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Input
              value={step.title}
              onChange={(e) => updateStep(step.id, { title: e.target.value })}
              placeholder="Título del paso"
              required
              className="rounded-xl"
            />
            <Textarea
              value={step.description}
              onChange={(e) =>
                updateStep(step.id, { description: e.target.value })
              }
              placeholder="Descripción"
              className="rounded-xl resize-none"
            />
          </div>
        ))}
      </div>

      <Button
        type="submit"
        disabled={saving}
        className="w-full rounded-full bg-[#0066cc] py-6 hover:bg-[#0055b3] sm:w-auto sm:px-10"
      >
        {saving ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
