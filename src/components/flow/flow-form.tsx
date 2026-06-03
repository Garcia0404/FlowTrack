"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import type {
  Flow,
  FlowStep,
} from "@/types/flow";

import { createId } from "@/utils/id";
import { nowIso } from "@/utils/date";

export interface FlowFormValues {
  title: string;
  description: string;
  date: string;
  steps: FlowStep[];
}

function emptyStep(
  order: number
): FlowStep {
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
  onSubmit: (
    values: FlowFormValues
  ) => Promise<void>;
  submitLabel: string;
}) {
  const [title, setTitle] =
    useState(
      initial?.title ?? ""
    );

  const [
    description,
    setDescription,
  ] = useState(
    initial?.description ?? ""
  );

  const [date, setDate] =
    useState(
      initial?.date?.slice(
        0,
        10
      ) ??
        new Date()
          .toISOString()
          .slice(0, 10)
    );

  const [steps, setSteps] =
    useState<FlowStep[]>(
      initial?.steps?.length
        ? [...initial.steps].sort(
            (a, b) =>
              a.order - b.order
          )
        : [emptyStep(0)]
    );

  const [saving, setSaving] =
    useState(false);

  const updateStep = (
    id: string,
    patch: Partial<FlowStep>
  ) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === id
          ? {
              ...step,
              ...patch,
            }
          : step
      )
    );
  };

  const addStep = () => {
    setSteps((prev) => [
      ...prev,
      emptyStep(prev.length),
    ]);
  };

  const removeStep = (
    id: string
  ) => {
    setSteps((prev) =>
      prev
        .filter(
          (step) =>
            step.id !== id
        )
        .map((step, index) => ({
          ...step,
          order: index,
        }))
    );
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setSaving(true);

    try {
      await onSubmit({
        title,
        description,
        date: new Date(
          date
        ).toISOString(),
        steps: steps.map(
          (step, index) => ({
            ...step,
            order: index,
          })
        ),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={(e) =>
        void handleSubmit(e)
      }
      className="space-y-8"
    >
      <div
        className="
          space-y-5
          rounded-3xl
          border
          border-border
          bg-card
          p-6
        "
      >
        <div className="space-y-2">
          <Label>
            Título del flujo
          </Label>

          <Input
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            placeholder="Servicio de Transporte"
            required
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label>
            Descripción
          </Label>

          <Textarea
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            className="
              min-h-24
              resize-none
              rounded-xl
            "
          />
        </div>

        <div className="space-y-2">
          <Label>Fecha</Label>

          <Input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(
                e.target.value
              )
            }
            className="
              h-11
              rounded-xl
            "
          />
        </div>
      </div>

      <div className="space-y-4">
        <div
          className="
            flex
            items-center
            justify-between
          "
        >
          <h2
            className="
              text-lg
              font-semibold
              tracking-tight
              text-foreground
            "
          >
            Pasos
          </h2>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addStep}
            className="
              rounded-full
              border-border
            "
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Añadir paso
          </Button>
        </div>

        {steps.map(
          (step, index) => (
            <div
              key={step.id}
              className="
                space-y-4
                rounded-3xl
                border
                border-border
                bg-card
                p-5
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <span
                  className="
                    text-sm
                    font-medium
                    text-muted-foreground
                  "
                >
                  Paso{" "}
                  {index + 1}
                </span>

                {steps.length >
                  1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() =>
                      removeStep(
                        step.id
                      )
                    }
                    className="
                      text-destructive
                      hover:text-destructive
                    "
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <Input
                value={step.title}
                onChange={(e) =>
                  updateStep(
                    step.id,
                    {
                      title:
                        e.target
                          .value,
                    }
                  )
                }
                placeholder="Título del paso"
                required
                className="
                  h-11
                  rounded-xl
                "
              />

              <Textarea
                value={
                  step.description
                }
                onChange={(e) =>
                  updateStep(
                    step.id,
                    {
                      description:
                        e.target
                          .value,
                    }
                  )
                }
                placeholder="Descripción"
                className="
                  min-h-24
                  resize-none
                  rounded-xl
                "
              />
            </div>
          )
        )}
      </div>

      <Button
        type="submit"
        disabled={saving}
        className="
          h-11
          w-full
          rounded-full
          sm:w-auto
          sm:px-8
        "
      >
        {saving
          ? "Guardando..."
          : submitLabel}
      </Button>
    </form>
  );
}