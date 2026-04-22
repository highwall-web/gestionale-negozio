import { asc, count, desc, eq, ilike } from "drizzle-orm";
import { products } from "../schema/products";
import { db } from "../config/db";
import { ColorResponse, CreateColorRequest, UpdateColorRequest } from "../dto/color.dto";
import { ColorMapper } from "../mapper/color.mapper";
import { colors } from "../schema/colors";
import { HttpError } from "../common/httpError";
import { HttpStatus } from "../common/httpStatus";
import { PaginatedResponse, SortOrder } from "../common/pagination";

export class ColorService {

    async create(request: CreateColorRequest): Promise<ColorResponse> {
        const [saved] = await db.insert(colors).values({
            nome: request.nome
        }).returning();

        return ColorMapper.toResponse(saved);
    }

    async getAllPaginated(
        page: number = 1,
        pageSize: number = 20,
        sortOrder: SortOrder = "asc",
        nome?: string
    ): Promise<PaginatedResponse<ColorResponse>> {
        const orderExpr = sortOrder === "desc" ? desc(colors.nome) : asc(colors.nome);
        const where = nome ? ilike(colors.nome, `%${nome}%`) : undefined;

        const [{ total }] = await db.select({ total: count() }).from(colors).where(where);
        const result = await db.select().from(colors)
            .where(where)
            .orderBy(orderExpr)
            .limit(pageSize)
            .offset((page - 1) * pageSize);
        return {
            data: result.map(r => ColorMapper.toResponse(r)),
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    }

    async getAll(): Promise<ColorResponse[]> {
        const result = await db.select().from(colors);
        return result.map(r => ColorMapper.toResponse(r));
    }

    async search(nome: string): Promise<ColorResponse[]> {
        const result = await db.select().from(colors).where(ilike(colors.nome, `%${nome}%`)).limit(10);
        return result.map(r => ColorMapper.toResponse(r));
    }

    async getByName(nome: string): Promise<ColorResponse> {
        const result = await db.select().from(colors).where(ilike(colors.nome, nome));
        const color = result.at(0);
        if (!color) throw new HttpError(HttpStatus.NOT_FOUND, "Colore non trovato");
        return ColorMapper.toResponse(color);
    }

    async getById(id: number): Promise<ColorResponse> {
        const result = await db.select().from(colors).where(eq(colors.id, id));
        const color = result.at(0);
        if (!color) throw new HttpError(HttpStatus.NOT_FOUND, "Colore non trovato");
        return ColorMapper.toResponse(color);
    }

    async update(id: number, request: UpdateColorRequest): Promise<ColorResponse> {
        const result = await db.select().from(colors).where(eq(colors.id, id));
        const color = result.at(0);
        if (!color) throw new HttpError(HttpStatus.NOT_FOUND, "Colore non trovato");

        const [updated] = await db.update(colors).set({ nome: request.nome }).where(eq(colors.id, id)).returning();
        return ColorMapper.toResponse(updated);
    }

    async delete(id: number): Promise<void> {
        const result = await db.select().from(colors).where(eq(colors.id, id));
        const color = result.at(0);
        if (!color) throw new HttpError(HttpStatus.NOT_FOUND, "Colore non trovato");

        const linked = await db.select().from(products).where(eq(products.colorId, id));
        if (linked.length > 0)
            throw new HttpError(HttpStatus.CONFLICT, "Impossibile eliminare: esistono prodotti collegati a questo colore");

        await db.delete(colors).where(eq(colors.id, id));
    }

}
