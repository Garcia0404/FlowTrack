import { localStorageAdapter } from "@/adapters/local-storage.adapter";
import { LOCAL_CREDENTIALS, LOCAL_USER } from "@/constants/auth";
import { STORAGE_KEYS } from "@/constants/storage";
import type { AuthSession, LoginCredentials } from "@/types/auth";
import type { IAuthRepository } from "@/types/repositories";
import { createId } from "@/utils/id";
import { nowIso } from "@/utils/date";

export class LocalAuthRepository implements IAuthRepository {
  async getSession(): Promise<AuthSession | null> {
    return localStorageAdapter.get<AuthSession | null>(STORAGE_KEYS.auth, null);
  }

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    if (
      credentials.email !== LOCAL_CREDENTIALS.email ||
      credentials.password !== LOCAL_CREDENTIALS.password
    ) {
      throw new Error("Credenciales inválidas");
    }

    const session: AuthSession = {
      user: LOCAL_USER,
      token: createId("token"),
      createdAt: nowIso(),
    };
    await this.saveSession(session);
    return session;
  }

  async logout(): Promise<void> {
    await this.saveSession(null);
  }

  async saveSession(session: AuthSession | null): Promise<void> {
    if (session) {
      localStorageAdapter.set(STORAGE_KEYS.auth, session);
    } else {
      localStorageAdapter.remove(STORAGE_KEYS.auth);
    }
  }
}
