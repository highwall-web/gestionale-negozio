import { eq } from "drizzle-orm";
import { db } from "../config/db";
import {
    RepairDetailsResponse,
    UpdateRepairDetailsRequest,
    UpdateDataConsegnaRequest,
    AddMessageRequest,
    RepairMessageResponse,
} from "../dto/repairDetails.dto";
import { RepairDetailsMapper } from "../mapper/repairDetails.mapper";
import { repairDetails } from "../schema/repairDetails";
import { repairDetailsInterventions } from "../schema/repairDetailsInterventions";
import { repairMessages } from "../schema/repairMessages";
import { interventions } from "../schema/interventions";
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

        for (const i of request.interventi) {
            await db.insert(repairDetailsInterventions).values({
                repairDetailsId: details.id,
                interventionId: i.interventionId,
                quantita: i.quantita,
            });
        }

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

    async deleteMessage(repairId: string, messageId: number): Promise<void> {
        const details = await this.findByRepairId(repairId);

        const result = await db.select().from(repairMessages)
            .where(eq(repairMessages.id, messageId));
        const message = result.at(0);

        if (!message || message.repairDetailsId !== details.id) {
            throw new HttpError(HttpStatus.NOT_FOUND, "Messaggio non trovato");
        }

        await db.delete(repairMessages).where(eq(repairMessages.id, messageId));
    }

}
