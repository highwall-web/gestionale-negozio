import { eq, inArray } from "drizzle-orm";
import { db } from "../config/db";
import {
    RepairDetailsResponse,
    UpdateRepairDetailsRequest,
    UpdateDataConsegnaRequest,
    AddMessageRequest,
    UpdateMessageRequest,
    RepairMessageResponse,
} from "../dto/repairDetails.dto";
import { RepairDetailsMapper } from "../mapper/repairDetails.mapper";
import { repairDetails } from "../schema/repairDetails";
import { repairDetailsInterventions } from "../schema/repairDetailsInterventions";
import { repairMessages } from "../schema/repairMessages";
import { interventions } from "../schema/interventions";
import { repairs } from "../schema/repairs";
import { HttpError } from "../common/httpError";
import { HttpStatus } from "../common/httpStatus";

export class RepairDetailsService {

    private async findByRepairId(repairId: string) {
        const result = await db.select().from(repairDetails).where(eq(repairDetails.repairId, repairId));
        const details = result.at(0);
        if (!details) throw new HttpError(HttpStatus.NOT_FOUND, "Dettagli riparazione non trovati");
        return details;
    }

    private async buildResponse(details: typeof repairDetails.$inferSelect): Promise<RepairDetailsResponse> {
        const rdiRows = await db.select().from(repairDetailsInterventions)
            .innerJoin(interventions, eq(repairDetailsInterventions.interventionId, interventions.id))
            .where(eq(repairDetailsInterventions.repairDetailsId, details.id));

        const interventi = rdiRows.map(r =>
            RepairDetailsMapper.toInterventionQuantita(r.repair_details_interventions, r.interventions)
        );

        const messaggiRows = await db.select().from(repairMessages)
            .where(eq(repairMessages.repairDetailsId, details.id));

        const messaggi = messaggiRows.map(m => RepairDetailsMapper.toMessage(m));

        return RepairDetailsMapper.toResponse(details, interventi, messaggi);
    }

    async get(repairId: string): Promise<RepairDetailsResponse> {
        const details = await this.findByRepairId(repairId);
        return this.buildResponse(details);
    }

    async update(repairId: string, request: UpdateRepairDetailsRequest): Promise<RepairDetailsResponse> {
        const details = await this.findByRepairId(repairId);

        const [updated] = await db.update(repairDetails).set({
            isPreventivo: request.isPreventivo,
            dataConsegna: request.dataConsegna ? new Date(request.dataConsegna) : null,
            acconto: request.acconto != null ? String(request.acconto) : null,
        }).where(eq(repairDetails.id, details.id)).returning();

        await db.delete(repairDetailsInterventions)
            .where(eq(repairDetailsInterventions.repairDetailsId, details.id));

        let costoTotale = 0;
        if (request.interventi.length > 0) {
            const ids = request.interventi.map(i => i.interventionId);
            const interventionsData = await db.select().from(interventions).where(inArray(interventions.id, ids));

            for (const i of request.interventi) {
                const intervention = interventionsData.find(inv => inv.id === i.interventionId)!;
                await db.insert(repairDetailsInterventions).values({
                    repairDetailsId: details.id,
                    interventionId: i.interventionId,
                    quantita: i.quantita,
                    prezzoUnitario: intervention.prezzo,
                });
                costoTotale += parseFloat(intervention.prezzo) * i.quantita;
            }
        }

        await db.update(repairs)
            .set({ costoTotale: String(costoTotale) })
            .where(eq(repairs.id, repairId));

        return this.buildResponse(updated);
    }

    async updateDataConsegna(repairId: string, request: UpdateDataConsegnaRequest): Promise<RepairDetailsResponse> {
        const details = await this.findByRepairId(repairId);

        const [updated] = await db.update(repairDetails).set({
            dataConsegna: request.dataConsegna ? new Date(request.dataConsegna) : null,
        }).where(eq(repairDetails.id, details.id)).returning();

        return this.buildResponse(updated);
    }

    async delete(repairId: string): Promise<void> {
        const details = await this.findByRepairId(repairId);

        await db.delete(repairMessages).where(eq(repairMessages.repairDetailsId, details.id));
        await db.delete(repairDetailsInterventions).where(eq(repairDetailsInterventions.repairDetailsId, details.id));
        await db.delete(repairDetails).where(eq(repairDetails.id, details.id));
    }

    async addMessage(repairId: string, request: AddMessageRequest, autore: string): Promise<RepairMessageResponse> {
        const details = await this.findByRepairId(repairId);

        const [saved] = await db.insert(repairMessages).values({
            repairDetailsId: details.id,
            testo: request.testo,
            autore,
            createdAt: new Date(),
        }).returning();

        return RepairDetailsMapper.toMessage(saved);
    }

    private async findMessage(repairId: string, messageId: number, autore: string) {
        const details = await this.findByRepairId(repairId);

        const result = await db.select().from(repairMessages).where(eq(repairMessages.id, messageId));
        const message = result.at(0);

        if (!message || message.repairDetailsId !== details.id)
            throw new HttpError(HttpStatus.NOT_FOUND, "Messaggio non trovato");

        if (message.autore !== autore)
            throw new HttpError(HttpStatus.FORBIDDEN, "Non sei l'autore di questo messaggio");

        return message;
    }

    async deleteMessage(repairId: string, messageId: number, autore: string): Promise<void> {
        await this.findMessage(repairId, messageId, autore);
        await db.delete(repairMessages).where(eq(repairMessages.id, messageId));
    }

    async updateMessage(repairId: string, messageId: number, request: UpdateMessageRequest, autore: string): Promise<RepairMessageResponse> {
        await this.findMessage(repairId, messageId, autore);

        const [updated] = await db.update(repairMessages)
            .set({ testo: request.testo })
            .where(eq(repairMessages.id, messageId))
            .returning();

        return RepairDetailsMapper.toMessage(updated);
    }

}
