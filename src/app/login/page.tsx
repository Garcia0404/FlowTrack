import { Suspense } from "react";
import { Workflow } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4">
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-card text-foreground border border-border">
          <Workflow className="h-7 w-7" />
        </div>

        <h1 className="text-4xl font-bold tracking-[-0.03em] text-foreground">
          FlowTrack
        </h1>

        <p className="mt-3 max-w-xs text-base leading-7 text-muted-foreground text-pretty">
          Organiza tus flujos de trabajo y haz seguimiento de tu progreso
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-48 w-full max-w-sm animate-pulse rounded-3xl border border-border bg-card" />
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}