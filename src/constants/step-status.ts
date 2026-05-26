import type { StepStatus } from "@/types/flow";
import {
  AlertCircle,
  CheckCircle2,
  Circle,
  Loader2,
  type LucideIcon,
} from "lucide-react";

export const STEP_STATUS_LABELS: Record<StepStatus, string> = {
  pending: "Pendiente",
  in_progress: "En proceso",
  completed: "Completo",
  incomplete: "Incompleto",
};

export const STEP_STATUS_ICONS: Record<StepStatus, LucideIcon> = {
  pending: Circle,
  in_progress: Loader2,
  completed: CheckCircle2,
  incomplete: AlertCircle,
};

export const STEP_STATUS_STYLES: Record<
  StepStatus,
  { bg: string; border: string; text: string; dot: string }
> = {
  pending: {
    bg: "bg-foreground/30",
    border: "border-foreground/40",
    text: "text-foreground/80",
    dot: "bg-foreground/60",
  },
  in_progress: {
    bg: "bg-primary/10",
    border: "border-primary/50",
    text: "text-primary",
    dot: "bg-primary",
  },
  completed: {
    bg: "bg-green-700/20",
    border: "border-green-700/50",
    text: "text-green-800",
    dot: "bg-green-700",
  },
  incomplete: {
    bg: "bg-red-700/20",
    border: "border-red-700/50",
    text: "text-red-800",
    dot: "bg-red-700",
  },
};
