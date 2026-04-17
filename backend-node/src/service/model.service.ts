import { and, asc, count, desc, eq, ilike, SQL } from "drizzle-orm";
import { db } from "../config/db";
import { ModelResponse, CreateModelRequest, UpdateModelRequest, ModelSortBy } from "../dto/model.dto";
import { ModelMapper } from "../mapper/model.mapper";
import { models } from "../schema/models";
import { brands } from "../schema/brands";
import { HttpError } from "../common/httpError";
import { HttpStatus } from "../common/httpStatus";
import { PaginatedResponse, SortOrder } from "../common/pagination";

export class ModelService {

    async create(request: CreateModelRequest): Promise<ModelResponse> {
        const brandResult = await db.select().from(brands).where(ilike(brands.nome, request.brandNome));
        const brand = brandResult.at(0)
            ?? (await db.insert(brands).values({ nome: request.brandNome }).returning()).at(0)!;

        const [saved] = await db.insert(models).values({
            nome: request.nome,
            tipoDispositivo: request.tipoDispositivo,
            brandId: brand.id,
        }).returning();

        return ModelMapper.toResponse(saved, brand);
    }

    async getAllPaginated(
        page: number = 1,
        pageSize: number = 20,
        sortBy: ModelSortBy = "nome",
        sortOrder: SortOrder = "asc",
        nome?: string,
        brandNome?: string,
        tipoDispositivo?: string
    ): Promise<PaginatedResponse<ModelResponse>> {
        const colMap = { nome: models.nome, brand: brands.nome };
        const orderExpr = sortOrder === "desc" ? desc(colMap[sortBy]) : asc(colMap[sortBy]);

        const filters: SQL[] = [];
        if (nome) filters.push(ilike(models.nome, `%${nome}%`));
        if (brandNome) filters.push(ilike(brands.nome, `%${brandNome}%`));
        if (tipoDispositivo) filters.push(ilike(models.tipoDispositivo, tipoDispositivo));
        const where = filters.length > 0 ? and(...filters) : undefined;

        const [{ total }] = await db.select({ total: count() })
            .from(models)
            .innerJoin(brands, eq(models.brandId, brands.id))
            .where(where);

        const result = await db.select().from(models)
            .innerJoin(brands, eq(models.brandId, brands.id))
            .where(where)
            .orderBy(orderExpr)
            .limit(pageSize)
            .offset((page - 1) * pageSize);
        return {
            data: result.map(r => ModelMapper.toResponse(r.models, r.brands)),
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    }

    async getAll(): Promise<ModelResponse[]> {
        const result = await db.select().from(models).innerJoin(brands, eq(models.brandId, brands.id));
        return result.map(r => ModelMapper.toResponse(r.models, r.brands));
    }

    async search(nome: string): Promise<ModelResponse[]> {
        const result = await db.select().from(models)
            .innerJoin(brands, eq(models.brandId, brands.id))
            .where(ilike(models.nome, `%${nome}%`))
            .limit(10);
        return result.map(r => ModelMapper.toResponse(r.models, r.brands));
    }

    async searchByBrand(brandId: number, nome: string): Promise<ModelResponse[]> {
        const result = await db.select().from(models)
            .innerJoin(brands, eq(models.brandId, brands.id))
            .where(and(eq(models.brandId, brandId), ilike(models.nome, `%${nome}%`)))
            .limit(10);
        return result.map(r => ModelMapper.toResponse(r.models, r.brands));
    }

    async searchByBrandName(brandNome: string, nome: string): Promise<ModelResponse[]> {
        const result = await db.select().from(models)
            .innerJoin(brands, eq(models.brandId, brands.id))
            .where(and(ilike(brands.nome, `%${brandNome}%`), ilike(models.nome, `%${nome}%`)))
            .limit(10);
        return result.map(r => ModelMapper.toResponse(r.models, r.brands));
    }

    async getByBrandId(id: number): Promise<ModelResponse[]> {
        const result = await db.select().from(models)
            .innerJoin(brands, eq(models.brandId, brands.id))
            .where(eq(models.brandId, id));
        return result.map(r => ModelMapper.toResponse(r.models, r.brands));
    }

    async getByName(nome: string): Promise<ModelResponse> {
        const result = await db.select().from(models)
            .innerJoin(brands, eq(models.brandId, brands.id))
            .where(ilike(models.nome, nome));
        const row = result.at(0);
        if (!row) throw new HttpError(HttpStatus.NOT_FOUND, "Modello non trovato");
        return ModelMapper.toResponse(row.models, row.brands);
    }

    async getById(id: number): Promise<ModelResponse> {
        const result = await db.select().from(models)
            .innerJoin(brands, eq(models.brandId, brands.id))
            .where(eq(models.id, id));
        const row = result.at(0);
        if (!row) throw new HttpError(HttpStatus.NOT_FOUND, "Modello non trovato");
        return ModelMapper.toResponse(row.models, row.brands);
    }

    async update(id: number, request: UpdateModelRequest): Promise<ModelResponse> {
        const existing = await db.select().from(models).where(eq(models.id, id));
        if (!existing.at(0)) throw new HttpError(HttpStatus.NOT_FOUND, "Modello non trovato");

        const brandResult = await db.select().from(brands).where(eq(brands.id, request.brandId));
        const brand = brandResult.at(0);
        if (!brand) throw new HttpError(HttpStatus.NOT_FOUND, "Brand non trovato");

        const [updated] = await db.update(models).set({
            nome: request.nome,
            tipoDispositivo: request.tipoDispositivo,
            brandId: request.brandId,
        }).where(eq(models.id, id)).returning();

        return ModelMapper.toResponse(updated, brand);
    }

    async delete(id: number): Promise<void> {
        const result = await db.select().from(models).where(eq(models.id, id));
        if (!result.at(0)) throw new HttpError(HttpStatus.NOT_FOUND, "Modello non trovato");

        await db.delete(models).where(eq(models.id, id));
    }

}
