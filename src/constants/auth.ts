import type { User } from "@/types/auth";

export const LOCAL_USER: User = {
  id: "user-local-1",
  email: "admin@flowtrack.app",
  name: "FlowTrack Admin",
};

export const LOCAL_CREDENTIALS = {
  email: "admin@flowtrack.app",
  password: "flowtrack2024",
} as const;
