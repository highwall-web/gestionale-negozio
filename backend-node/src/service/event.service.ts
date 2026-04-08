import { between, eq } from "drizzle-orm";
import { db } from "../config/db";
import { CreateEventRequest, EventResponse, UpdateEventRequest } from "../dto/event.dto";
import { EventMapper } from "../mapper/event.mapper";
import { events } from "../schema/events";
import { HttpError } from "../common/httpError";
import { HttpStatus } from "../common/httpStatus";

export class EventService {

    private async findById(id: number) {
        const result = await db.select().from(events).where(eq(events.id, id));
        const event = result.at(0);
        if (!event) throw new HttpError(HttpStatus.NOT_FOUND, "Evento non trovato");
        return event;
    }

    async getByRangeData(from: string, to: string): Promise<EventResponse[]> {
        const rows = await db.select().from(events).where(between(events.dataEvento, from, to));
        return rows.map(EventMapper.toResponse);
    }

    async getAll(): Promise<EventResponse[]> {
        const rows = await db.select().from(events);
        return rows.map(EventMapper.toResponse);
    }

    async getById(id: number): Promise<EventResponse> {
        const event = await this.findById(id);
        return EventMapper.toResponse(event);
    }

    async create(request: CreateEventRequest): Promise<EventResponse> {
        const [saved] = await db.insert(events).values({
            descrizione: request.descrizione,
            dataEvento: request.dataEvento,
            oraInizio: request.oraInizio,
            oraFine: request.oraFine,
        }).returning();
        return EventMapper.toResponse(saved);
    }

    async update(id: number, request: UpdateEventRequest): Promise<EventResponse> {
        await this.findById(id);

        const [updated] = await db.update(events).set({
            descrizione: request.descrizione,
            dataEvento: request.dataEvento,
            oraInizio: request.oraInizio,
            oraFine: request.oraFine,
        }).where(eq(events.id, id)).returning();

        return EventMapper.toResponse(updated);
    }

    async delete(id: number): Promise<void> {
        await this.findById(id);
        await db.delete(events).where(eq(events.id, id));
    }

}
