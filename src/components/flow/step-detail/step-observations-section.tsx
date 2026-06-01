"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface StepObservationsSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export function StepObservationsSection({
  value,
  onChange,
}: StepObservationsSectionProps) {
  return (
    <div>
      <Label className="text-[13px] font-medium text-[#404040]">
        Observaciones
      </Label>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Notas internas del paso..."
        className="mt-2 min-h-18 rounded-xl border-[#e5e5e5] placeholder:text-[#737373]"
      />
    </div>
  );
}