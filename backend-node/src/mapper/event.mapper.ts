import { EventResponse } from "../dto/event.dto";
import { events } from "../schema/events";

type EventEntity = typeof events.$inferSelect;

export class EventMapper {

    static toResponse(entity: EventEntity): EventResponse {
        return {
            id: entity.id,
            descrizione: entity.descrizione,
            dataEvento: entity.dataEvento,
            oraInizio: entity.oraInizio,
            oraFine: entity.oraFine,
        };
    }

}
