import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants/storage";
import { authService } from "@/services/auth.service";
import type { AuthSession, LoginCredentials } from "@/types/auth";
import { setAuthCookie, clearAuthCookie } from "@/utils/cookies";

interface AuthState {
  session: AuthSession | null;
  isHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      isHydrated: false,
      isLoading: false,
      error: null,

      hydrate: async () => {
        const session = await authService.getSession();
        if (session) setAuthCookie();
        set({ session, isHydrated: true });
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const session = await authService.login(credentials);
          set({ session, isLoading: false, error: null });
          return true;
        } catch (e) {
          set({
            error: e instanceof Error ? e.message : "Error de autenticación",
            isLoading: false,
          });
          return false;
        }
      },

      logout: async () => {
        await authService.logout();
        clearAuthCookie();
        set({ session: null, error: null, isLoading: false });
      },
    }),
    {
      name: `${STORAGE_KEYS.auth}:store`,
      partialize: (s) => ({ session: s.session }),
      onRehydrateStorage: () => (state) => {
        if (state?.session) setAuthCookie();
        if (state) state.isHydrated = true;
      },
    }
  )
);
