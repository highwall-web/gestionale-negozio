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
import { ColorResponse, CreateColorRequest, UpdateColorRequest } from "../dto/color.dto";

@Route("colors")
@Tags("Colors")
export class ColorController extends Controller {
  @Post("/")
  @OperationId("createColor")
  public async createColor(@Body() body: CreateColorRequest): Promise<ColorResponse> {
    throw new Error("Not implemented");
  }

  @Get("/")
  @OperationId("getAllColors")
  public async getAllColors(): Promise<ColorResponse[]> {
    throw new Error("Not implemented");
  }

  @Get("/search")
  @OperationId("searchColors")
  public async searchColors(@Query() nome: string): Promise<ColorResponse[]> {
    throw new Error("Not implemented");
  }

  @Get("/by-name/{nome}")
  @OperationId("getColorByName")
  public async getColorByName(@Path() nome: string): Promise<ColorResponse> {
    throw new Error("Not implemented");
  }

  @Get("/{id}")
  @OperationId("getColorById")
  public async getColorById(@Path() id: number): Promise<ColorResponse> {
    throw new Error("Not implemented");
  }

  @Put("/{id}")
  @OperationId("updateColor")
  public async updateColor(
    @Path() id: number,
    @Body() body: UpdateColorRequest
  ): Promise<ColorResponse> {
    throw new Error("Not implemented");
  }

  @Delete("/{id}")
  @OperationId("deleteColor")
  public async deleteColor(@Path() id: number): Promise<void> {
    throw new Error("Not implemented");
  }
}
