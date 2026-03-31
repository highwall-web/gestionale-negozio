import { Role } from "./auth.dto";

export interface UserResponse {
  id: number;
  username: string;
  nome: string;
  email: string;
  role: Role;
  enabled: boolean;
}

export interface UpdateUserRequest {
  nome?: string;
  email?: string;
  password?: string;
}
