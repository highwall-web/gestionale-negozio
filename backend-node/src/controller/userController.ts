import {
    Body,
    Controller,
    Get,
    OperationId,
    Put,
    Request,
    Route,
    Security,
    Tags,
} from "tsoa";
import { UserResponse, UpdateUserRequest } from "../dto/user.dto";
import { UserService } from "../service/user.service";
import { AccessTokenPayload } from "../common/token";
import express from "express";

const userService = new UserService();

@Route("users")
@Tags("Users")
@Security("bearerAuth")
export class UserController extends Controller {
    @Get("/me")
    @OperationId("getCurrentUser")
    public async getCurrentUser(@Request() request: express.Request): Promise<UserResponse> {
        const username = ((request as unknown as { user: AccessTokenPayload }).user).sub!;
        return userService.getByUsername(username);
    }

    @Put("/me")
    @OperationId("updateCurrentUser")
    public async updateCurrentUser(
        @Body() body: UpdateUserRequest,
        @Request() request: express.Request
    ): Promise<UserResponse> {
        const username = ((request as unknown as { user: AccessTokenPayload }).user).sub!;
        return userService.update(username, body);
    }
}
