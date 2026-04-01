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
    Query,
    Request,
    Route,
    Security,
    Tags,
} from "tsoa";
import {
    RepairResponse,
    CreateRepairRequest,
    UpdateRepairRequest,
    UpdateStatoRepairRequest,
    StatoRepair,
    StatoRiparazione,
    PageResponse,
} from "../dto/repair.dto";
import { RepairService } from "../service/repair.service";
import { AccessTokenPayload } from "../common/token";
import express from "express";

const repairService = new RepairService();

@Route("repairs")
@Tags("Repairs")
@Security("bearerAuth")
export class RepairController extends Controller {
    @Post("/")
    @OperationId("createRepair")
    public async createRepair(
        @Body() body: CreateRepairRequest,
        @Request() request: express.Request
    ): Promise<RepairResponse> {
        const autore = ((request as unknown as { user: AccessTokenPayload }).user).sub!;
        return repairService.create(body, autore);
    }

    @Get("/")
    @OperationId("getAllRepairs")
    public async getAllRepairs(
        @Query() page?: number,
        @Query() size?: number
    ): Promise<PageResponse<RepairResponse>> {
        return repairService.getAll(page, size);
    }

    @Get("/search")
    @OperationId("searchRepairs")
    public async searchRepairs(
        @Query() stato?: StatoRepair,
        @Query() statoRiparazione?: StatoRiparazione,
        @Query() page?: number,
        @Query() size?: number
    ): Promise<PageResponse<RepairResponse>> {
        return repairService.search(stato, statoRiparazione, page, size);
    }

    @Get("/attive")
    @OperationId("getRepairsAttive")
    public async getRepairsAttive(): Promise<RepairResponse[]> {
        return repairService.getAttive();
    }

    @Get("/{id}")
    @OperationId("getRepairById")
    public async getRepairById(@Path() id: number): Promise<RepairResponse> {
        return repairService.getById(id);
    }

    @Put("/{id}")
    @OperationId("updateRepair")
    public async updateRepair(
        @Path() id: number,
        @Body() body: UpdateRepairRequest
    ): Promise<RepairResponse> {
        return repairService.update(id, body);
    }

    @Patch("/{id}/stato")
    @OperationId("updateStatoRepair")
    public async updateStatoRepair(
        @Path() id: number,
        @Body() body: UpdateStatoRepairRequest
    ): Promise<RepairResponse> {
        return repairService.updateStato(id, body);
    }

    @Delete("/{id}")
    @OperationId("deleteRepair")
    public async deleteRepair(@Path() id: number): Promise<void> {
        return repairService.delete(id);
    }
}
