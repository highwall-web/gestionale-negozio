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
import { CreateEventRequest, EventResponse, UpdateEventRequest } from "../dto/event.dto";
import { EventService } from "../service/event.service";

const eventService = new EventService();

@Route("events")
@Tags("Events")
@Security("bearerAuth")
export class EventController extends Controller {

    @Get("/")
    @OperationId("getAllEvents")
    public async getAllEvents(): Promise<EventResponse[]> {
        return eventService.getAll();
    }

    @Get("/range-data")
    @OperationId("getEventsByRangeData")
    public async getEventsByRangeData(
        @Query() from: string,
        @Query() to: string
    ): Promise<EventResponse[]> {
        return eventService.getByRangeData(from, to);
    }

    @Get("/{id}")
    @OperationId("getEventById")
    public async getEventById(@Path() id: number): Promise<EventResponse> {
        return eventService.getById(id);
    }

    @Post("/")
    @OperationId("createEvent")
    public async createEvent(@Body() body: CreateEventRequest): Promise<EventResponse> {
        return eventService.create(body);
    }

    @Put("/{id}")
    @OperationId("updateEvent")
    public async updateEvent(
        @Path() id: number,
        @Body() body: UpdateEventRequest
    ): Promise<EventResponse> {
        return eventService.update(id, body);
    }

    @Delete("/{id}")
    @OperationId("deleteEvent")
    public async deleteEvent(@Path() id: number): Promise<void> {
        return eventService.delete(id);
    }

}
