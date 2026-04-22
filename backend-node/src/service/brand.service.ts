import { asc, count, desc, eq, ilike } from "drizzle-orm";
import { models } from "../schema/models";
import { db } from "../config/db";
import { BrandResponse, CreateBrandRequest, UpdateBrandRequest } from "../dto/brand.dto";
import { BrandMapper } from "../mapper/brand.mapper";
import { brands } from "../schema/brands";
import { HttpError } from "../common/httpError";
import { HttpStatus } from "../common/httpStatus";
import { PaginatedResponse, SortOrder } from "../common/pagination";

export class BrandService {

    async create(request: CreateBrandRequest): Promise<BrandResponse> {
        const [saved] = await db.insert(brands).values({
            nome: request.nome
        }).returning();

        return BrandMapper.toResponse(saved);
    }

    async getAllPaginated(
        page: number = 1,
        pageSize: number = 20,
        sortOrder: SortOrder = "asc",
        nome?: string
    ): Promise<PaginatedResponse<BrandResponse>> {
        const orderExpr = sortOrder === "desc" ? desc(brands.nome) : asc(brands.nome);
        const where = nome ? ilike(brands.nome, `%${nome}%`) : undefined;

        const [{ total }] = await db.select({ total: count() }).from(brands).where(where);
        const result = await db.select().from(brands)
            .where(where)
            .orderBy(orderExpr)
            .limit(pageSize)
            .offset((page - 1) * pageSize);
        return {
            data: result.map(r => BrandMapper.toResponse(r)),
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    }

    async getAll(): Promise<BrandResponse[]> {
        const result = await db.select().from(brands);
        return result.map(r => BrandMapper.toResponse(r));
    }

    async getById(id: number): Promise<BrandResponse> {
        const result = await db.select().from(brands).where(eq(brands.id, id));
        const brand = result.at(0);
        if (!brand) throw new HttpError(HttpStatus.NOT_FOUND, "Brand non trovato");
        return BrandMapper.toResponse(brand);
    }

    async search(nome: string): Promise<BrandResponse[]> {
        const result = await db.select().from(brands).where(ilike(brands.nome, `%${nome}%`)).limit(10);
        return result.map(r => BrandMapper.toResponse(r));
    }

    async getByName(nome: string): Promise<BrandResponse> {
        const result = await db.select().from(brands).where(ilike(brands.nome, nome));
        const brand = result.at(0);
        if (!brand) throw new HttpError(HttpStatus.NOT_FOUND, "Brand non trovato");
        return BrandMapper.toResponse(brand);
    }

    async update(id: number, request: UpdateBrandRequest): Promise<BrandResponse> {
        const result = await db.select().from(brands).where(eq(brands.id, id));
        const brand = result.at(0);
        if (!brand) throw new HttpError(HttpStatus.NOT_FOUND, "Brand non trovato");

        const [updated] = await db.update(brands).set({ nome: request.nome }).where(eq(brands.id, id)).returning();
        return BrandMapper.toResponse(updated);
    }

    async delete(id: number) {
        const result = await db.select().from(brands).where(eq(brands.id, id));
        const brand = result.at(0);
        if (!brand) throw new HttpError(HttpStatus.NOT_FOUND, "Brand non trovato");

        const linked = await db.select().from(models).where(eq(models.brandId, id));
        if (linked.length > 0)
            throw new HttpError(HttpStatus.CONFLICT, "Impossibile eliminare: esistono modelli collegati a questo brand");

        await db.delete(brands).where(eq(brands.id, id));
    }
}