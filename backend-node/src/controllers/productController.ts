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
  Tags,
} from "tsoa";
import { ProductResponse, UpdateProductRequest } from "../dto/product.dto";

@Route("products")
@Tags("Products")
export class ProductController extends Controller {
  @Get("/")
  @OperationId("getAllProducts")
  public async getAllProducts(): Promise<ProductResponse[]> {
    throw new Error("Not implemented");
  }

  @Get("/search")
  @OperationId("searchProducts")
  public async searchProducts(@Query() modelNome: string): Promise<ProductResponse[]> {
    throw new Error("Not implemented");
  }

  @Get("/by-seriale/{seriale}")
  @OperationId("getProductBySeriale")
  public async getProductBySeriale(@Path() seriale: string): Promise<ProductResponse> {
    throw new Error("Not implemented");
  }

  @Get("/by-imei/{imei}")
  @OperationId("getProductByImei")
  public async getProductByImei(@Path() imei: string): Promise<ProductResponse> {
    throw new Error("Not implemented");
  }

  @Get("/{id}")
  @OperationId("getProductById")
  public async getProductById(@Path() id: number): Promise<ProductResponse> {
    throw new Error("Not implemented");
  }

  @Put("/{id}")
  @OperationId("updateProduct")
  public async updateProduct(
    @Path() id: number,
    @Body() body: UpdateProductRequest
  ): Promise<ProductResponse> {
    throw new Error("Not implemented");
  }

  @Delete("/{id}")
  @OperationId("deleteProduct")
  public async deleteProduct(@Path() id: number): Promise<void> {
    throw new Error("Not implemented");
  }
}
