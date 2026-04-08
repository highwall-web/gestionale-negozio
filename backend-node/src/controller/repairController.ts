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
    RepairRangeResponse,
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

    @Get("/senza-data-riconsegna-stimata")
    @OperationId("getRepairsSenzaDataRiconsegnaStiamata")
    public async getRepairsSenzaDataRiconsegnaStiamata(): Promise<RepairResponse[]> {
        return repairService.getSenzaDataRiconsegnaStiamata();
    }

    @Get("/range-data-consegna")
    @OperationId("getRepairsByRangeDataConsegna")
    public async getRepairsByRangeDataConsegna(
        @Query() from: string,
        @Query() to: string
    ): Promise<RepairRangeResponse[]> {
        return repairService.getByRangeDataConsegna(new Date(from), new Date(to));
    }

    @Get("/{id}")
    @OperationId("getRepairById")
    public async getRepairById(@Path() id: string): Promise<RepairResponse> {
        return repairService.getById(id);
    }

    @Put("/{id}")
    @OperationId("updateRepair")
    public async updateRepair(
        @Path() id: string,
        @Body() body: UpdateRepairRequest
    ): Promise<RepairResponse> {
        return repairService.update(id, body);
    }

    @Patch("/{id}/stato")
    @OperationId("updateStatoRepair")
    public async updateStatoRepair(
        @Path() id: string,
        @Body() body: UpdateStatoRepairRequest
    ): Promise<RepairResponse> {
        return repairService.updateStato(id, body);
    }

    @Delete("/{id}")
    @OperationId("deleteRepair")
    public async deleteRepair(@Path() id: string): Promise<void> {
        return repairService.delete(id);
    }
}
