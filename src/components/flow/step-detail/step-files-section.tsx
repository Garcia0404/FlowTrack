"use client";

import type { FlowStep } from "@/types/flow";

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
      <h4 className="mb-2 text-[13px] font-semibold text-[#737373]">
        Archivos (simulados)
      </h4>

      {files.map((file) => (
        <p
          key={file.id}
          className="text-[13px] text-[#404040]"
        >
          {file.name}
        </p>
      ))}
    </div>
  );
}