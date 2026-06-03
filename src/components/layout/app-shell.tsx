"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Plus, Workflow } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = useAuthStore((s) => s.logout);
  const session = useAuthStore((s) => s.session);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
    router.refresh();
  };

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card">
              <Workflow className="h-4 w-4 text-foreground" />
            </div>

            <span className="text-[17px] font-semibold tracking-[-0.02em] text-foreground">
              FlowTrack
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              href="/flows/new"
              className={cn(
                buttonVariants({
                  size: "sm",
                }),
                "hidden rounded-full px-4 sm:inline-flex",
                pathname === "/flows/new" &&
                  "opacity-80"
              )}
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Nuevo flujo
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-sm font-normal"
                  />
                }
              >
                {isHydrated
                  ? session?.user.name
                  : null}
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="rounded-xl border-border bg-card"
              >
                <DropdownMenuItem
                  onClick={() =>
                    void handleLogout()
                  }
                  className="cursor-pointer text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>

      <Link
        href="/flows/new"
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-95 sm:hidden"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
}