import { AUTH_COOKIE } from "@/constants/storage";

export function setAuthCookie(): void {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 30;
  document.cookie = `${AUTH_COOKIE}=1; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
