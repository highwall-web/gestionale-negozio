import { and, eq, ilike, isNull } from "drizzle-orm";
import { db } from "../config/db";
import { InterventionResponse, CreateInterventionRequest, UpdateInterventionRequest } from "../dto/intervention.dto";
import { InterventionMapper } from "../mapper/intervention.mapper";
import { interventions } from "../schema/interventions";
import { models } from "../schema/models";
import { HttpError } from "../common/httpError";
import { HttpStatus } from "../common/httpStatus";

export class InterventionService {

    async create(request: CreateInterventionRequest): Promise<InterventionResponse> {
        const [saved] = await db.insert(interventions).values({
            modelId: request.modelId,
            nome: request.nome,
            prezzo: String(request.prezzo),
            periodoGaranzia: request.periodoGaranzia,
        }).returning();

        const model = saved.modelId
            ? (await db.select().from(models).where(eq(models.id, saved.modelId))).at(0)
            : null;

        return InterventionMapper.toResponse(saved, model);
    }

    async getAll(): Promise<InterventionResponse[]> {
        const result = await db.select().from(interventions)
            .leftJoin(models, eq(interventions.modelId, models.id));
        return result.map(r => InterventionMapper.toResponse(r.interventions, r.models));
    }

    async getInterventiGenerali(): Promise<InterventionResponse[]> {
        const result = await db.select().from(interventions)
            .leftJoin(models, eq(interventions.modelId, models.id))
            .where(isNull(interventions.modelId));
        return result.map(r => InterventionMapper.toResponse(r.interventions, r.models));
    }

    async search(nome: string): Promise<InterventionResponse[]> {
        const result = await db.select().from(interventions)
            .leftJoin(models, eq(interventions.modelId, models.id))
            .where(ilike(interventions.nome, `%${nome}%`))
            .limit(10);
        return result.map(r => InterventionMapper.toResponse(r.interventions, r.models));
    }

    async searchByModel(modelId: number, nome: string): Promise<InterventionResponse[]> {
        const result = await db.select().from(interventions)
            .leftJoin(models, eq(interventions.modelId, models.id))
            .where(and(eq(interventions.modelId, modelId), ilike(interventions.nome, `%${nome}%`)))
            .limit(10);
        return result.map(r => InterventionMapper.toResponse(r.interventions, r.models));
    }

    async getByModel(modelId: number): Promise<InterventionResponse[]> {
        const result = await db.select().from(interventions)
            .leftJoin(models, eq(interventions.modelId, models.id))
            .where(eq(interventions.modelId, modelId));
        return result.map(r => InterventionMapper.toResponse(r.interventions, r.models));
    }

    async getByName(nome: string): Promise<InterventionResponse> {
        const result = await db.select().from(interventions)
            .leftJoin(models, eq(interventions.modelId, models.id))
            .where(ilike(interventions.nome, nome));
        const row = result.at(0);
        if (!row) throw new HttpError(HttpStatus.NOT_FOUND, "Intervento non trovato");
        return InterventionMapper.toResponse(row.interventions, row.models);
    }

    async getById(id: number): Promise<InterventionResponse> {
        const result = await db.select().from(interventions)
            .leftJoin(models, eq(interventions.modelId, models.id))
            .where(eq(interventions.id, id));
        const row = result.at(0);
        if (!row) throw new HttpError(HttpStatus.NOT_FOUND, "Intervento non trovato");
        return InterventionMapper.toResponse(row.interventions, row.models);
    }

    async update(id: number, request: UpdateInterventionRequest): Promise<InterventionResponse> {
        const existing = await db.select().from(interventions).where(eq(interventions.id, id));
        if (!existing.at(0)) throw new HttpError(HttpStatus.NOT_FOUND, "Intervento non trovato");

        const [updated] = await db.update(interventions).set({
            modelId: request.modelId,
            nome: request.nome,
            prezzo: String(request.prezzo),
            periodoGaranzia: request.periodoGaranzia,
        }).where(eq(interventions.id, id)).returning();

        const model = updated.modelId
            ? (await db.select().from(models).where(eq(models.id, updated.modelId))).at(0)
            : null;

        return InterventionMapper.toResponse(updated, model);
    }

    async delete(id: number): Promise<void> {
        const result = await db.select().from(interventions).where(eq(interventions.id, id));
        if (!result.at(0)) throw new HttpError(HttpStatus.NOT_FOUND, "Intervento non trovato");

        await db.delete(interventions).where(eq(interventions.id, id));
    }

}
