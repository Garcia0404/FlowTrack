"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuthStore } from "@/stores/auth-store";
import { LOCAL_CREDENTIALS } from "@/constants/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);

  const [email, setEmail] = useState(
    LOCAL_CREDENTIALS.email as string
  );

  const [password, setPassword] = useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const ok = await login({
      email,
      password,
    });

    if (ok) {
      const from =
        searchParams.get("from") || "/";

      router.replace(from);
      router.refresh();
    }
  };

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="w-full max-w-sm space-y-6"
    >
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-sm font-medium text-foreground"
        >
          Email
        </Label>

        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          placeholder="Ingresa tu email"
          className="h-11 rounded-full border-border bg-background px-4"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-sm font-medium text-foreground"
        >
          Contraseña
        </Label>

        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          placeholder="Ingresa tu contraseña"
          className="h-11 rounded-full border-border bg-background px-4"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="h-11 w-full rounded-full"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Iniciar sesión"
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Demo: {LOCAL_CREDENTIALS.email} / {LOCAL_CREDENTIALS.password}
      </p>
    </form>
  );
}