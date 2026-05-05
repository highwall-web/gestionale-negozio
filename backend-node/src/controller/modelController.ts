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
import { ModelResponse, CreateModelRequest, UpdateModelRequest, ModelSortBy } from "../dto/model.dto";
import { ModelService } from "../service/model.service";
import { PaginatedResponse, SortOrder } from "../common/pagination";

const modelService = new ModelService();

@Route("models")
@Tags("Models")
@Security("bearerAuth")
export class ModelController extends Controller {
    @Post("/")
    @OperationId("createModel")
    public async createModel(@Body() body: CreateModelRequest): Promise<ModelResponse> {
        return modelService.create(body);
    }

    @Get("/")
    @OperationId("getAllModels")
    public async getAllModels(): Promise<ModelResponse[]> {
        return modelService.getAll();
    }

    @Get("/paginated")
    @OperationId("getAllModelsPaginated")
    public async getAllModelsPaginated(
        @Query() page?: number,
        @Query() pageSize?: number,
        @Query() sortBy?: ModelSortBy,
        @Query() sortOrder?: SortOrder,
        @Query() nome?: string,
        @Query() brandNome?: string,
        @Query() tipoDispositivo?: string
    ): Promise<PaginatedResponse<ModelResponse>> {
        return modelService.getAllPaginated(page, pageSize, sortBy, sortOrder, nome, brandNome, tipoDispositivo);
    }

    @Get("/search")
    @OperationId("searchModels")
    public async searchModels(@Query() nome: string): Promise<ModelResponse[]> {
        return modelService.search(nome);
    }

    @Get("/search/by-brand")
    @OperationId("searchModelsByBrand")
    public async searchModelsByBrand(
        @Query() brandId: number,
        @Query() nome: string
    ): Promise<ModelResponse[]> {
        return modelService.searchByBrand(brandId, nome);
    }

    @Get("/search/by-brand-name")
    @OperationId("searchModelsByBrandName")
    public async searchModelsByBrandName(
        @Query() brandNome: string,
        @Query() nome: string
    ): Promise<ModelResponse[]> {
        return modelService.searchByBrandName(brandNome, nome);
    }

    @Get("/by-brand-id/{id}")
    @OperationId("getModelsByBrandId")
    public async getModelsByBrandId(@Path() id: number): Promise<ModelResponse[]> {
        return modelService.getByBrandId(id);
    }

    @Get("/by-name/{nome}")
    @OperationId("getModelByName")
    public async getModelByName(@Path() nome: string): Promise<ModelResponse> {
        return modelService.getByName(nome);
    }

    @Get("/{id}")
    @OperationId("getModelById")
    public async getModelById(@Path() id: number): Promise<ModelResponse> {
        return modelService.getById(id);
    }

    @Put("/{id}")
    @OperationId("updateModel")
    public async updateModel(
        @Path() id: number,
        @Body() body: UpdateModelRequest
    ): Promise<ModelResponse> {
        return modelService.update(id, body);
    }

    @Delete("/{id}")
    @OperationId("deleteModel")
    public async deleteModel(@Path() id: number): Promise<void> {
        return modelService.delete(id);
    }
}
