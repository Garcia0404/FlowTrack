"use client";

import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/stores/auth-store";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    document.documentElement.style.colorScheme = "light only";
    document.documentElement.classList.remove("dark");
    void hydrate();
  }, [hydrate]);

  return (
    <>
      {children}
      <Toaster
        position="bottom-center"
        toastOptions={{
          classNames: {
            toast:
              "rounded-2xl border border-[#e5e5e5] bg-white text-foreground shadow-sm",
          },
        }}
      />
    </>
  );
}
