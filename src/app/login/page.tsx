import { Suspense } from "react";
import { Workflow } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#f5f5f7] px-4">
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#272729] text-white">
          <Workflow className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
          FlowTrack
        </h1>
        <p className="mt-2 max-w-xs text-[15px] text-[#737373]">
          Workflows visuales con la precisión de un producto Apple.
        </p>
      </div>
      <Suspense fallback={<div className="h-48 w-full max-w-sm animate-pulse rounded-2xl border border-[#e5e5e5] bg-white" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
