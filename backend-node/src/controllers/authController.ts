import {
  Body,
  Controller,
  OperationId,
  Post,
  Route,
  Tags,
} from "tsoa";
import { LoginRequest, LoginResponse, RegisterRequest } from "../dto/auth.dto";

@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {
  @Post("/login")
  @OperationId("login")
  public async login(@Body() body: LoginRequest): Promise<LoginResponse> {
    throw new Error("Not implemented");
  }

  @Post("/register")
  @OperationId("register")
  public async register(@Body() body: RegisterRequest): Promise<void> {
    throw new Error("Not implemented");
  }

  @Post("/refresh")
  @OperationId("refresh")
  public async refresh(): Promise<LoginResponse> {
    throw new Error("Not implemented");
  }

  @Post("/logout")
  @OperationId("logout")
  public async logout(): Promise<void> {
    throw new Error("Not implemented");
  }
}
