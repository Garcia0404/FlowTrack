import { getAuthRepository } from "@/lib/repository-factory";
import type { AuthSession, LoginCredentials } from "@/types/auth";
import { clearAuthCookie, setAuthCookie } from "@/utils/cookies";

export class AuthService {
  private repo = getAuthRepository();

  async getSession(): Promise<AuthSession | null> {
    return this.repo.getSession();
  }

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const session = await this.repo.login(credentials);
    setAuthCookie();
    return session;
  }

  async logout(): Promise<void> {
    await this.repo.logout();
    clearAuthCookie();
  }
}

export const authService = new AuthService();
