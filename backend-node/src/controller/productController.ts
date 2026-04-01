import {
    Body,
    Controller,
    Delete,
    Get,
    OperationId,
    Path,
    Put,
    Query,
    Route,
    Security,
    Tags,
} from "tsoa";
import { ProductResponse, UpdateProductRequest } from "../dto/product.dto";
import { ProductService } from "../service/product.service";

const productService = new ProductService();

@Route("products")
@Tags("Products")
@Security("bearerAuth")
export class ProductController extends Controller {
    @Get("/")
    @OperationId("getAllProducts")
    public async getAllProducts(): Promise<ProductResponse[]> {
        return productService.getAll();
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

    @Delete("/{id}")
    @OperationId("deleteProduct")
    public async deleteProduct(@Path() id: number): Promise<void> {
        return productService.delete(id);
    }
}
