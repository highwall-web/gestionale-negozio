export interface EventResponse {
    id: number;
    descrizione: string;
    dataEvento: string;
    oraInizio: string;
    oraFine: string;
}

export interface CreateEventRequest {
    descrizione: string;
    dataEvento: string;
    oraInizio: string;
    oraFine: string;
}

export interface UpdateEventRequest {
    descrizione: string;
    dataEvento: string;
    oraInizio: string;
    oraFine: string;
}
