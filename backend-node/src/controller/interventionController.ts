import {
  Body,
  Controller,
  Delete,
  Get,
  OperationId,
  Path,
  Post,
  Put,
  Query,
  Route,
  Tags,
} from "tsoa";
import {
  InterventionResponse,
  CreateInterventionRequest,
  UpdateInterventionRequest,
} from "../dto/intervention.dto";

@Route("interventions")
@Tags("Interventions")
export class InterventionController extends Controller {
  @Post("/")
  @OperationId("createIntervention")
  public async createIntervention(
    @Body() body: CreateInterventionRequest
  ): Promise<InterventionResponse> {
    throw new Error("Not implemented");
  }

  @Get("/")
  @OperationId("getAllInterventions")
  public async getAllInterventions(): Promise<InterventionResponse[]> {
    throw new Error("Not implemented");
  }

  @Get("/generali")
  @OperationId("getInterventiGenerali")
  public async getInterventiGenerali(): Promise<InterventionResponse[]> {
    throw new Error("Not implemented");
  }

  @Get("/search")
  @OperationId("searchInterventions")
  public async searchInterventions(@Query() nome: string): Promise<InterventionResponse[]> {
    throw new Error("Not implemented");
  }

  @Get("/search/by-model")
  @OperationId("searchInterventionsByModel")
  public async searchInterventionsByModel(
    @Query() modelId: number,
    @Query() nome: string
  ): Promise<InterventionResponse[]> {
    throw new Error("Not implemented");
  }

  @Get("/by-model/{modelId}")
  @OperationId("getInterventionsByModel")
  public async getInterventionsByModel(@Path() modelId: number): Promise<InterventionResponse[]> {
    throw new Error("Not implemented");
  }

  @Get("/by-name/{nome}")
  @OperationId("getInterventionByName")
  public async getInterventionByName(@Path() nome: string): Promise<InterventionResponse> {
    throw new Error("Not implemented");
  }

  @Get("/{id}")
  @OperationId("getInterventionById")
  public async getInterventionById(@Path() id: number): Promise<InterventionResponse> {
    throw new Error("Not implemented");
  }

  @Put("/{id}")
  @OperationId("updateIntervention")
  public async updateIntervention(
    @Path() id: number,
    @Body() body: UpdateInterventionRequest
  ): Promise<InterventionResponse> {
    throw new Error("Not implemented");
  }

  @Delete("/{id}")
  @OperationId("deleteIntervention")
  public async deleteIntervention(@Path() id: number): Promise<void> {
    throw new Error("Not implemented");
  }
}
