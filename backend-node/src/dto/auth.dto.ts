export type Role = "ADMIN" | "COMMESSO";

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  accessToken: string;
}

export interface RegisterRequest {
  username: string;
  nome: string;
  email: string;
  password: string;
  role: Role;
}
