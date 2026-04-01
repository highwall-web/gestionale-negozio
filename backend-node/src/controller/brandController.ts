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
import { BrandResponse, CreateBrandRequest, UpdateBrandRequest } from "../dto/brand.dto";
import { BrandService } from "../service/brand.service";

const brandService = new BrandService();

@Route("brands")
@Tags("Brands")
@Security("bearerAuth")
export class BrandController extends Controller {

    @Post("/")
    @OperationId("createBrand")
    public async createBrand(@Body() body: CreateBrandRequest): Promise<BrandResponse> {
        return brandService.create(body);
    }

    @Get("/")
    @OperationId("getAllBrands")
    public async getAllBrands(): Promise<BrandResponse[]> {
        return brandService.getAll();
    }

    @Get("/search")
    @OperationId("searchBrands")
    public async searchBrands(@Query() nome: string): Promise<BrandResponse[]> {
        return brandService.search(nome);
    }

    @Get("/by-name/{nome}")
    @OperationId("getBrandByName")
    public async getBrandByName(@Path() nome: string): Promise<BrandResponse> {
        return brandService.getByName(nome);
    }

    @Get("/{id}")
    @OperationId("getBrandById")
    public async getBrandById(@Path() id: number): Promise<BrandResponse> {
        return brandService.getById(id);
    }

    @Put("/{id}")
    @OperationId("updateBrand")
    public async updateBrand(
        @Path() id: number,
        @Body() body: UpdateBrandRequest
    ): Promise<BrandResponse> {
        return brandService.update(id, body);
    }

    @Delete("/{id}")
    @OperationId("deleteBrand")
    public async deleteBrand(@Path() id: number): Promise<void> {
        brandService.delete(id);
    }
}
