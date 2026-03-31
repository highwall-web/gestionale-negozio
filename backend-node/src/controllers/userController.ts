import {
  Body,
  Controller,
  Get,
  OperationId,
  Put,
  Route,
  Tags,
} from "tsoa";
import { UserResponse, UpdateUserRequest } from "../dto/user.dto";

@Route("users")
@Tags("Users")
export class UserController extends Controller {
  @Get("/me")
  @OperationId("getCurrentUser")
  public async getCurrentUser(): Promise<UserResponse> {
    throw new Error("Not implemented");
  }

  @Put("/me")
  @OperationId("updateCurrentUser")
  public async updateCurrentUser(@Body() body: UpdateUserRequest): Promise<UserResponse> {
    throw new Error("Not implemented");
  }
}
