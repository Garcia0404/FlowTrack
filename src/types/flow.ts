export type StepStatus = "pending" | "in_progress" | "completed" | "incomplete";

export type FlowStatus = "draft" | "active" | "completed" | "paused";

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface StepComment {
  id: string;
  text: string;
  createdAt: string;
}

export interface SimulatedFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
}

export interface FlowStep {
  id: string;
  title: string;
  description: string;
  status: StepStatus;
  checklist: ChecklistItem[];
  comments: StepComment[];
  observations: string;
  files: SimulatedFile[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Flow {
  id: string;
  title: string;
  description: string;
  date: string;
  status: FlowStatus;
  steps: FlowStep[];
  guidedStepIndex: number | null;
  isGuidedActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFlowInput {
  title: string;
  description: string;
  date: string;
  steps?: Omit<FlowStep, "id" | "createdAt" | "updatedAt">[];
}

export interface UpdateFlowInput {
  title?: string;
  description?: string;
  date?: string;
  status?: FlowStatus;
  steps?: FlowStep[];
  guidedStepIndex?: number | null;
  isGuidedActive?: boolean;
}

export interface FlowProgress {
  total: number;
  completed: number;
  incomplete: number;
  inProgress: number;
  pending: number;
  percent: number;
}
