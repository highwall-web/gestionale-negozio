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
    Security,
    Tags,
} from "tsoa";
import {
    InterventionResponse,
    CreateInterventionRequest,
    UpdateInterventionRequest,
    InterventionSortBy,
} from "../dto/intervention.dto";
import { PaginatedResponse, SortOrder } from "../common/pagination";
import { InterventionService } from "../service/intervention.service";

const interventionService = new InterventionService();

@Route("interventions")
@Tags("Interventions")
@Security("bearerAuth")
export class InterventionController extends Controller {
    @Post("/")
    @OperationId("createIntervention")
    public async createIntervention(
        @Body() body: CreateInterventionRequest
    ): Promise<InterventionResponse> {
        return interventionService.create(body);
    }

    @Get("/")
    @OperationId("getAllInterventions")
    public async getAllInterventions(
        @Query() page?: number,
        @Query() pageSize?: number,
        @Query() sortBy?: InterventionSortBy,
        @Query() sortOrder?: SortOrder,
        @Query() nome?: string,
        @Query() modelId?: number
    ): Promise<PaginatedResponse<InterventionResponse>> {
        return interventionService.getAll(page, pageSize, sortBy, sortOrder, nome, modelId);
    }

    @Get("/generali")
    @OperationId("getInterventiGenerali")
    public async getInterventiGenerali(): Promise<InterventionResponse[]> {
        return interventionService.getInterventiGenerali();
    }

    @Get("/search")
    @OperationId("searchInterventions")
    public async searchInterventions(@Query() nome: string): Promise<InterventionResponse[]> {
        return interventionService.search(nome);
    }

    @Get("/search/by-model")
    @OperationId("searchInterventionsByModel")
    public async searchInterventionsByModel(
        @Query() modelId: number,
        @Query() nome: string
    ): Promise<InterventionResponse[]> {
        return interventionService.searchByModel(modelId, nome);
    }

    @Get("/by-model/{modelId}")
    @OperationId("getInterventionsByModel")
    public async getInterventionsByModel(@Path() modelId: number): Promise<InterventionResponse[]> {
        return interventionService.getByModel(modelId);
    }

    @Get("/by-name/{nome}")
    @OperationId("getInterventionByName")
    public async getInterventionByName(@Path() nome: string): Promise<InterventionResponse> {
        return interventionService.getByName(nome);
    }

    @Get("/{id}")
    @OperationId("getInterventionById")
    public async getInterventionById(@Path() id: number): Promise<InterventionResponse> {
        return interventionService.getById(id);
    }

    @Put("/{id}")
    @OperationId("updateIntervention")
    public async updateIntervention(
        @Path() id: number,
        @Body() body: UpdateInterventionRequest
    ): Promise<InterventionResponse> {
        return interventionService.update(id, body);
    }

    @Delete("/{id}")
    @OperationId("deleteIntervention")
    public async deleteIntervention(@Path() id: number): Promise<void> {
        return interventionService.delete(id);
    }
}
