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
import { ModelResponse, CreateModelRequest, UpdateModelRequest } from "../dto/model.dto";

@Route("models")
@Tags("Models")
export class ModelController extends Controller {
  @Post("/")
  @OperationId("createModel")
  public async createModel(@Body() body: CreateModelRequest): Promise<ModelResponse> {
    throw new Error("Not implemented");
  }

  @Get("/")
  @OperationId("getAllModels")
  public async getAllModels(): Promise<ModelResponse[]> {
    throw new Error("Not implemented");
  }

  @Get("/search")
  @OperationId("searchModels")
  public async searchModels(@Query() nome: string): Promise<ModelResponse[]> {
    throw new Error("Not implemented");
  }

  @Get("/search/by-brand")
  @OperationId("searchModelsByBrand")
  public async searchModelsByBrand(
    @Query() brandId: number,
    @Query() nome: string
  ): Promise<ModelResponse[]> {
    throw new Error("Not implemented");
  }

  @Get("/search/by-brand-name")
  @OperationId("searchModelsByBrandName")
  public async searchModelsByBrandName(
    @Query() brandNome: string,
    @Query() nome: string
  ): Promise<ModelResponse[]> {
    throw new Error("Not implemented");
  }

  @Get("/by-brand-id/{id}")
  @OperationId("getModelsByBrandId")
  public async getModelsByBrandId(@Path() id: number): Promise<ModelResponse[]> {
    throw new Error("Not implemented");
  }

  @Get("/by-name/{nome}")
  @OperationId("getModelByName")
  public async getModelByName(@Path() nome: string): Promise<ModelResponse> {
    throw new Error("Not implemented");
  }

  @Get("/{id}")
  @OperationId("getModelById")
  public async getModelById(@Path() id: number): Promise<ModelResponse> {
    throw new Error("Not implemented");
  }

  @Put("/{id}")
  @OperationId("updateModel")
  public async updateModel(
    @Path() id: number,
    @Body() body: UpdateModelRequest
  ): Promise<ModelResponse> {
    throw new Error("Not implemented");
  }

  @Delete("/{id}")
  @OperationId("deleteModel")
  public async deleteModel(@Path() id: number): Promise<void> {
    throw new Error("Not implemented");
  }
}
