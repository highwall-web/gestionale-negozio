import {
  Body,
  Controller,
  OperationId,
  Post,
  Request,
  Route,
  Security,
  Tags,
} from "tsoa";
import { Request as ExRequest, Response as ExResponse } from "express";
import { LoginRequest, LoginResponse, RegisterRequest } from "../dto/auth.dto";
import { AuthService } from "../service/auth.service";

interface RequestWithRes extends ExRequest {
  res: ExResponse
};

const authService = new AuthService();

@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {
  @Post("/login")
  @OperationId("login")
  public async login(@Body() body: LoginRequest, @Request() req: ExRequest): Promise<LoginResponse> {
    return authService.login(body, (req as RequestWithRes).res);
  }

  @Post("/register")
  @OperationId("register")
  @Security("bearerAuth", ["ADMIN"])
  public async register(@Body() body: RegisterRequest): Promise<void> {
    return authService.register(body);
  }

  @Post("/refresh")
  @OperationId("refresh")
  public async refresh(@Request() req: ExRequest): Promise<LoginResponse> {
    return authService.refresh(req, (req as RequestWithRes).res);
  }

  @Post("/logout")
  @OperationId("logout")
  @Security("bearerAuth")
  public async logout(@Request() req: ExRequest): Promise<void> {
    return authService.logout(req, (req as RequestWithRes).res);
  }
}
