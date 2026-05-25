import type { AuthSession, LoginCredentials } from "./auth";
import type { CreateFlowInput, Flow, UpdateFlowInput } from "./flow";

export interface IFlowRepository {
  findAll(): Promise<Flow[]>;
  findById(id: string): Promise<Flow | null>;
  create(input: CreateFlowInput): Promise<Flow>;
  update(id: string, input: UpdateFlowInput): Promise<Flow>;
  delete(id: string): Promise<void>;
  saveAll(flows: Flow[]): Promise<void>;
}

export interface IAuthRepository {
  getSession(): Promise<AuthSession | null>;
  login(credentials: LoginCredentials): Promise<AuthSession>;
  logout(): Promise<void>;
  saveSession(session: AuthSession | null): Promise<void>;
}
