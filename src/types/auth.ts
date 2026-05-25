export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthSession {
  user: User;
  token: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
