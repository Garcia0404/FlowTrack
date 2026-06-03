"use client";

import type { FlowStep } from "@/types/flow";
import { StepSectionTitle } from "./step-section-title";

interface StepFilesSectionProps {
  files: FlowStep["files"];
}

export function StepFilesSection({
  files,
}: StepFilesSectionProps) {
  if (files.length === 0) {
    return null;
  }

  return (
    <div>
      <StepSectionTitle>Archivos</StepSectionTitle>

      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="
              rounded-xl
              border
              border-border
              bg-card
              px-3
              py-2
            "
          >
            <p
              className="
                text-sm
                text-foreground
                break-all
              "
            >
              {file.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}