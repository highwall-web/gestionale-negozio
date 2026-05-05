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
import { ColorResponse, CreateColorRequest, UpdateColorRequest } from "../dto/color.dto";
import { ColorService } from "../service/color.service";
import { PaginatedResponse, SortOrder } from "../common/pagination";

const colorService = new ColorService();

@Route("colors")
@Tags("Colors")
@Security("bearerAuth")
export class ColorController extends Controller {
    @Post("/")
    @OperationId("createColor")
    public async createColor(@Body() body: CreateColorRequest): Promise<ColorResponse> {
        return colorService.create(body);
    }

    @Get("/")
    @OperationId("getAllColors")
    public async getAllColors(): Promise<ColorResponse[]> {
        return colorService.getAll();
    }

    @Get("/paginated")
    @OperationId("getAllColorsPaginated")
    public async getAllColorsPaginated(
        @Query() page?: number,
        @Query() pageSize?: number,
        @Query() sortOrder?: SortOrder,
        @Query() nome?: string
    ): Promise<PaginatedResponse<ColorResponse>> {
        return colorService.getAllPaginated(page, pageSize, sortOrder, nome);
    }

    @Get("/search")
    @OperationId("searchColors")
    public async searchColors(@Query() nome: string): Promise<ColorResponse[]> {
        return colorService.search(nome);
    }

    @Get("/by-name/{nome}")
    @OperationId("getColorByName")
    public async getColorByName(@Path() nome: string): Promise<ColorResponse> {
        return colorService.getByName(nome);
    }

    @Get("/{id}")
    @OperationId("getColorById")
    public async getColorById(@Path() id: number): Promise<ColorResponse> {
        return colorService.getById(id);
    }

    @Put("/{id}")
    @OperationId("updateColor")
    public async updateColor(
        @Path() id: number,
        @Body() body: UpdateColorRequest
    ): Promise<ColorResponse> {
        return colorService.update(id, body);
    }

    @Delete("/{id}")
    @OperationId("deleteColor")
    public async deleteColor(@Path() id: number): Promise<void> {
        return colorService.delete(id);
    }
}
