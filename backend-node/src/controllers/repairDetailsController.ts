import {
  Body,
  Controller,
  Delete,
  Get,
  OperationId,
  Path,
  Post,
  Put,
  Route,
  SuccessResponse,
  Tags,
} from "tsoa";
import {
  RepairDetailsResponse,
  UpdateRepairDetailsRequest,
  AddMessageRequest,
  RepairMessageResponse,
} from "../dto/repairDetails.dto";

@Route("repairs/{repairId}/details")
@Tags("RepairDetails")
export class RepairDetailsController extends Controller {
  @Get("/")
  @OperationId("getRepairDetails")
  public async getRepairDetails(@Path() repairId: number): Promise<RepairDetailsResponse> {
    throw new Error("Not implemented");
  }

  @Put("/")
  @OperationId("updateRepairDetails")
  public async updateRepairDetails(
    @Path() repairId: number,
    @Body() body: UpdateRepairDetailsRequest
  ): Promise<RepairDetailsResponse> {
    throw new Error("Not implemented");
  }

  @Delete("/")
  @OperationId("deleteRepairDetails")
  public async deleteRepairDetails(@Path() repairId: number): Promise<void> {
    throw new Error("Not implemented");
  }

  @Post("/messages")
  @OperationId("addRepairMessage")
  public async addRepairMessage(
    @Path() repairId: number,
    @Body() body: AddMessageRequest
  ): Promise<RepairMessageResponse> {
    throw new Error("Not implemented");
  }

  @Delete("/messages/{messageId}")
  @OperationId("deleteRepairMessage")
  public async deleteRepairMessage(
    @Path() repairId: number,
    @Path() messageId: number
  ): Promise<void> {
    throw new Error("Not implemented");
  }
}
