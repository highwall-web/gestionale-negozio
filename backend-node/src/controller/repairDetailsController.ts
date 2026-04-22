import {
    Body,
    Controller,
    Delete,
    Get,
    OperationId,
    Patch,
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
    UpdateDataConsegnaRequest,
    AddMessageRequest,
    UpdateMessageRequest,
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
    public async getRepairDetails(@Path() repairId: string): Promise<RepairDetailsResponse> {
        return repairDetailsService.get(repairId);
    }

    @Put("/")
    @OperationId("updateRepairDetails")
    public async updateRepairDetails(
        @Path() repairId: string,
        @Body() body: UpdateRepairDetailsRequest
    ): Promise<RepairDetailsResponse> {
        return repairDetailsService.update(repairId, body);
    }

    @Patch("/data-consegna")
    @OperationId("updateDataConsegna")
    public async updateDataConsegna(
        @Path() repairId: string,
        @Body() body: UpdateDataConsegnaRequest
    ): Promise<RepairDetailsResponse> {
        return repairDetailsService.updateDataConsegna(repairId, body);
    }

    @Delete("/")
    @OperationId("deleteRepairDetails")
    public async deleteRepairDetails(@Path() repairId: string): Promise<void> {
        return repairDetailsService.delete(repairId);
    }

    @Post("/messages")
    @OperationId("addRepairMessage")
    public async addRepairMessage(
        @Path() repairId: string,
        @Body() body: AddMessageRequest,
        @Request() request: express.Request
    ): Promise<RepairMessageResponse> {
        const autore = ((request as unknown as { user: AccessTokenPayload }).user).sub!;
        return repairDetailsService.addMessage(repairId, body, autore);
    }

    @Put("/messages/{messageId}")
    @OperationId("updateRepairMessage")
    public async updateRepairMessage(
        @Path() repairId: string,
        @Path() messageId: number,
        @Body() body: UpdateMessageRequest,
        @Request() request: express.Request
    ): Promise<RepairMessageResponse> {
        const autore = ((request as unknown as { user: AccessTokenPayload }).user).sub!;
        return repairDetailsService.updateMessage(repairId, messageId, body, autore);
    }

    @Delete("/messages/{messageId}")
    @OperationId("deleteRepairMessage")
    public async deleteRepairMessage(
        @Path() repairId: string,
        @Path() messageId: number,
        @Request() request: express.Request
    ): Promise<void> {
        const autore = ((request as unknown as { user: AccessTokenPayload }).user).sub!;
        return repairDetailsService.deleteMessage(repairId, messageId, autore);
    }
}
