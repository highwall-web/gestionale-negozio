import {
    Body,
    Controller,
    Delete,
    Get,
    OperationId,
    Path,
    Post,
    Put,
    Request,
    Route,
    Security,
    Tags,
} from "tsoa";
import {
    RepairDetailsResponse,
    UpdateRepairDetailsRequest,
    AddMessageRequest,
    RepairMessageResponse,
} from "../dto/repairDetails.dto";
import { RepairDetailsService } from "../service/repairDetails.service";
import { AccessTokenPayload } from "../common/token";
import express from "express";

const repairDetailsService = new RepairDetailsService();

@Route("repairs/{repairId}/details")
@Tags("RepairDetails")
@Security("bearerAuth")
export class RepairDetailsController extends Controller {
    @Get("/")
    @OperationId("getRepairDetails")
    public async getRepairDetails(@Path() repairId: number): Promise<RepairDetailsResponse> {
        return repairDetailsService.get(repairId);
    }

    @Put("/")
    @OperationId("updateRepairDetails")
    public async updateRepairDetails(
        @Path() repairId: number,
        @Body() body: UpdateRepairDetailsRequest
    ): Promise<RepairDetailsResponse> {
        return repairDetailsService.update(repairId, body);
    }

    @Delete("/")
    @OperationId("deleteRepairDetails")
    public async deleteRepairDetails(@Path() repairId: number): Promise<void> {
        return repairDetailsService.delete(repairId);
    }

    @Post("/messages")
    @OperationId("addRepairMessage")
    public async addRepairMessage(
        @Path() repairId: number,
        @Body() body: AddMessageRequest,
        @Request() request: express.Request
    ): Promise<RepairMessageResponse> {
        const autore = ((request as unknown as { user: AccessTokenPayload }).user).sub!;
        return repairDetailsService.addMessage(repairId, body, autore);
    }

    @Delete("/messages/{messageId}")
    @OperationId("deleteRepairMessage")
    public async deleteRepairMessage(
        @Path() repairId: number,
        @Path() messageId: number
    ): Promise<void> {
        return repairDetailsService.deleteMessage(repairId, messageId);
    }
}
