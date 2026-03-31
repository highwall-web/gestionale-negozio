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
import { BrandResponse, CreateBrandRequest, UpdateBrandRequest } from "../dto/brand.dto";

@Route("brands")
@Tags("Brands")
export class BrandController extends Controller {
  @Post("/")
  @OperationId("createBrand")
  public async createBrand(@Body() body: CreateBrandRequest): Promise<BrandResponse> {
    throw new Error("Not implemented");
  }

  @Get("/")
  @OperationId("getAllBrands")
  public async getAllBrands(): Promise<BrandResponse[]> {
    throw new Error("Not implemented");
  }

  @Get("/search")
  @OperationId("searchBrands")
  public async searchBrands(@Query() nome: string): Promise<BrandResponse[]> {
    throw new Error("Not implemented");
  }

  @Get("/by-name/{nome}")
  @OperationId("getBrandByName")
  public async getBrandByName(@Path() nome: string): Promise<BrandResponse> {
    throw new Error("Not implemented");
  }

  @Get("/{id}")
  @OperationId("getBrandById")
  public async getBrandById(@Path() id: number): Promise<BrandResponse> {
    throw new Error("Not implemented");
  }

  @Put("/{id}")
  @OperationId("updateBrand")
  public async updateBrand(
    @Path() id: number,
    @Body() body: UpdateBrandRequest
  ): Promise<BrandResponse> {
    throw new Error("Not implemented");
  }

  @Delete("/{id}")
  @OperationId("deleteBrand")
  public async deleteBrand(@Path() id: number): Promise<void> {
    throw new Error("Not implemented");
  }
}
