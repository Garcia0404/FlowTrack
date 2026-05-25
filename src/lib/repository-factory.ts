import { LocalAuthRepository } from "@/repositories/local-auth.repository";
import { LocalFlowRepository } from "@/repositories/local-flow.repository";
import type { IAuthRepository, IFlowRepository } from "@/types/repositories";

let flowRepository: IFlowRepository | null = null;
let authRepository: IAuthRepository | null = null;

export function getFlowRepository(): IFlowRepository {
  if (!flowRepository) {
    flowRepository = new LocalFlowRepository();
  }
  return flowRepository;
}

export function getAuthRepository(): IAuthRepository {
  if (!authRepository) {
    authRepository = new LocalAuthRepository();
  }
  return authRepository;
}
