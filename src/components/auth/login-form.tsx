"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
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

  const [email, setEmail] = useState<string>(LOCAL_CREDENTIALS.email);
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login({ email, password });
    if (ok) {
      const from = searchParams.get("from") || "/";
      router.replace(from);
      router.refresh();
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={(e) => void handleSubmit(e)}
      className="w-full max-w-sm space-y-5"
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 rounded-xl border-[#e5e5e5] bg-white placeholder:text-[#737373]"
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="flowtrack2024"
          className="h-11 rounded-xl border-[#e5e5e5] bg-white placeholder:text-[#737373]"
          autoComplete="current-password"
        />
      </div>
      {error && (
        <p className="text-[13px] text-[#c93400]">{error}</p>
      )}
      <Button
        type="submit"
        disabled={isLoading}
        className="h-11 w-full rounded-full bg-[#0066cc] hover:bg-[#0055b3] active:scale-[0.98]"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Iniciar sesión"
        )}
      </Button>
      <p className="text-center text-[12px] text-[#737373]">
        Demo: {LOCAL_CREDENTIALS.email} / {LOCAL_CREDENTIALS.password}
      </p>
    </motion.form>
  );
}
