import { eq, ilike } from "drizzle-orm";
import { db } from "../config/db";
import { ColorResponse, CreateColorRequest, UpdateColorRequest } from "../dto/color.dto";
import { ColorMapper } from "../mapper/color.mapper";
import { colors } from "../schema/colors";
import { HttpError } from "../common/httpError";
import { HttpStatus } from "../common/httpStatus";

export class ColorService {

    async create(request: CreateColorRequest): Promise<ColorResponse> {
        const [saved] = await db.insert(colors).values({
            nome: request.nome
        }).returning();

        return ColorMapper.toResponse(saved);
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

        await db.delete(colors).where(eq(colors.id, id));
    }

}
