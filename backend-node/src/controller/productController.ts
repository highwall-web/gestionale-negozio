import {
    Body,
    Controller,
    Delete,
    Get,
    OperationId,
    Patch,
    Path,
    Put,
    Query,
    Route,
    Security,
    Tags,
} from "tsoa";
import { ProductResponse, UpdateProductRequest, UpdateTestDiagnosticiRequest, ProductSortBy } from "../dto/product.dto";
import { PaginatedResponse, SortOrder } from "../common/pagination";
import { ProductService } from "../service/product.service";

const productService = new ProductService();

@Route("products")
@Tags("Products")
@Security("bearerAuth")
export class ProductController extends Controller {
    @Get("/")
    @OperationId("getAllProducts")
    public async getAllProducts(
        @Query() page?: number,
        @Query() pageSize?: number,
        @Query() sortBy?: ProductSortBy,
        @Query() sortOrder?: SortOrder,
        @Query() modello?: string,
        @Query() brand?: string
    ): Promise<PaginatedResponse<ProductResponse>> {
        return productService.getAll(page, pageSize, sortBy, sortOrder, modello, brand);
    }

    @Get("/search")
    @OperationId("searchProducts")
    public async searchProducts(@Query() modelNome: string): Promise<ProductResponse[]> {
        return productService.search(modelNome);
    }

    @Get("/by-seriale/{seriale}")
    @OperationId("getProductBySeriale")
    public async getProductBySeriale(@Path() seriale: string): Promise<ProductResponse> {
        return productService.getBySeriale(seriale);
    }

    @Get("/by-imei/{imei}")
    @OperationId("getProductByImei")
    public async getProductByImei(@Path() imei: string): Promise<ProductResponse> {
        return productService.getByImei(imei);
    }

    @Get("/{id}")
    @OperationId("getProductById")
    public async getProductById(@Path() id: number): Promise<ProductResponse> {
        return productService.getById(id);
    }

    @Put("/{id}")
    @OperationId("updateProduct")
    public async updateProduct(
        @Path() id: number,
        @Body() body: UpdateProductRequest
    ): Promise<ProductResponse> {
        return productService.update(id, body);
    }

    @Patch("/{id}/test-diagnostici")
    @OperationId("updateProductTestDiagnostici")
    public async updateProductTestDiagnostici(
        @Path() id: number,
        @Body() body: UpdateTestDiagnosticiRequest
    ): Promise<ProductResponse> {
        return productService.updateTestDiagnostici(id, body);
    }

    @Delete("/{id}")
    @OperationId("deleteProduct")
    public async deleteProduct(@Path() id: number): Promise<void> {
        return productService.delete(id);
    }
}
