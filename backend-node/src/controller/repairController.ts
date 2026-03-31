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
  Route,
  SuccessResponse,
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

@Route("repairs")
@Tags("Repairs")
export class RepairController extends Controller {
  @Post("/")
  @OperationId("createRepair")
  public async createRepair(@Body() body: CreateRepairRequest): Promise<RepairResponse> {
    throw new Error("Not implemented");
  }

  @Get("/")
  @OperationId("getAllRepairs")
  public async getAllRepairs(
    @Query() page?: number,
    @Query() size?: number
  ): Promise<PageResponse<RepairResponse>> {
    throw new Error("Not implemented");
  }

  @Get("/search")
  @OperationId("searchRepairs")
  public async searchRepairs(
    @Query() stato?: StatoRepair,
    @Query() statoRiparazione?: StatoRiparazione,
    @Query() page?: number,
    @Query() size?: number
  ): Promise<PageResponse<RepairResponse>> {
    throw new Error("Not implemented");
  }

  @Get("/attive")
  @OperationId("getRepairsAttive")
  public async getRepairsAttive(): Promise<RepairResponse[]> {
    throw new Error("Not implemented");
  }

  @Get("/{id}")
  @OperationId("getRepairById")
  public async getRepairById(@Path() id: number): Promise<RepairResponse> {
    throw new Error("Not implemented");
  }

  @Put("/{id}")
  @OperationId("updateRepair")
  public async updateRepair(
    @Path() id: number,
    @Body() body: UpdateRepairRequest
  ): Promise<RepairResponse> {
    throw new Error("Not implemented");
  }

  @Patch("/{id}/stato")
  @OperationId("updateStatoRepair")
  public async updateStatoRepair(
    @Path() id: number,
    @Body() body: UpdateStatoRepairRequest
  ): Promise<RepairResponse> {
    throw new Error("Not implemented");
  }

  @Delete("/{id}")
  @OperationId("deleteRepair")
  public async deleteRepair(@Path() id: number): Promise<void> {
    throw new Error("Not implemented");
  }
}
