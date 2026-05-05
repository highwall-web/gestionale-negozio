import { and, asc, count, desc, eq, ilike, SQL } from "drizzle-orm";
import { db } from "../config/db";
import { ProductResponse, UpdateProductRequest, ProductSortBy } from "../dto/product.dto";
import { ProductMapper } from "../mapper/product.mapper";
import { products } from "../schema/products";
import { repairs } from "../schema/repairs";
import { models } from "../schema/models";
import { colors } from "../schema/colors";
import { brands } from "../schema/brands";
import { HttpError } from "../common/httpError";
import { HttpStatus } from "../common/httpStatus";
import { PaginatedResponse, SortOrder } from "../common/pagination";

export class ProductService {

    private async fetchJoined(where?: SQL, limit?: number, offset?: number, orderBy?: SQL) {
        let query = db.select().from(products)
            .innerJoin(models, eq(products.modelId, models.id))
            .innerJoin(brands, eq(models.brandId, brands.id))
            .innerJoin(colors, eq(products.colorId, colors.id))
            .$dynamic();
        if (where) query = query.where(where);
        if (orderBy) query = query.orderBy(orderBy);
        if (limit) query = query.limit(limit);
        if (offset) query = query.offset(offset);
        return query;
    }

    async getAll(
        page: number = 1,
        pageSize: number = 20,
        sortBy: ProductSortBy = "modello",
        sortOrder: SortOrder = "asc",
        modello?: string,
        brand?: string
    ): Promise<PaginatedResponse<ProductResponse>> {
        const colMap = { modello: models.nome, brand: brands.nome };
        const orderExpr = sortOrder === "desc" ? desc(colMap[sortBy]) : asc(colMap[sortBy]);

        const filters: SQL[] = [];
        if (modello) filters.push(ilike(models.nome, `%${modello}%`));
        if (brand) filters.push(ilike(brands.nome, `%${brand}%`));
        const where = filters.length > 0 ? and(...filters) : undefined;

        const [{ total }] = filters.length > 0
            ? await db.select({ total: count() }).from(products)
                .innerJoin(models, eq(products.modelId, models.id))
                .innerJoin(brands, eq(models.brandId, brands.id))
                .where(where)
            : await db.select({ total: count() }).from(products);

        const result = await this.fetchJoined(where, pageSize, (page - 1) * pageSize, orderExpr);
        return {
            data: result.map(r => ProductMapper.toResponse(r.products, r.models, r.brands, r.colors)),
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    }

    async search(modelNome: string): Promise<ProductResponse[]> {
        const result = await this.fetchJoined(ilike(models.nome, `%${modelNome}%`), 10);
        return result.map(r => ProductMapper.toResponse(r.products, r.models, r.brands, r.colors));
    }

    async getBySeriale(seriale: string): Promise<ProductResponse> {
        const result = await this.fetchJoined(eq(products.seriale, seriale));
        const row = result.at(0);
        if (!row) throw new HttpError(HttpStatus.NOT_FOUND, "Prodotto non trovato");
        return ProductMapper.toResponse(row.products, row.models, row.brands, row.colors);
    }

    async getByImei(imei: string): Promise<ProductResponse> {
        const result = await this.fetchJoined(eq(products.imei, imei));
        const row = result.at(0);
        if (!row) throw new HttpError(HttpStatus.NOT_FOUND, "Prodotto non trovato");
        return ProductMapper.toResponse(row.products, row.models, row.brands, row.colors);
    }

    async getById(id: number): Promise<ProductResponse> {
        const result = await this.fetchJoined(eq(products.id, id));
        const row = result.at(0);
        if (!row) throw new HttpError(HttpStatus.NOT_FOUND, "Prodotto non trovato");
        return ProductMapper.toResponse(row.products, row.models, row.brands, row.colors);
    }

    async update(id: number, request: UpdateProductRequest): Promise<ProductResponse> {
        const existing = await db.select().from(products).where(eq(products.id, id));
        if (!existing.at(0)) throw new HttpError(HttpStatus.NOT_FOUND, "Prodotto non trovato");

        const modelResult = await db.select().from(models)
            .innerJoin(brands, eq(models.brandId, brands.id))
            .where(ilike(models.nome, request.model.nome));
        const modelRow = modelResult.at(0);
        if (!modelRow) throw new HttpError(HttpStatus.NOT_FOUND, "Modello non trovato");

        const colorResult = await db.select().from(colors).where(ilike(colors.nome, request.color.nome));
        const color = colorResult.at(0);
        if (!color) throw new HttpError(HttpStatus.NOT_FOUND, "Colore non trovato");

        const [updated] = await db.update(products).set({
            modelId: modelRow.models.id,
            colorId: color.id,
            capacita: request.capacita,
            codiceUnlock: request.codiceUnlock,
            sequenzaUnlock: request.sequenzaUnlock ? JSON.stringify(request.sequenzaUnlock) : null,
            pin: request.pin,
            accessori: request.accessori,
            contattoConLiquidi: request.contattoConLiquidi,
            dispositivoNonTestabile: request.dispositivoNonTestabile,
            acquistatoPressoDiNoi: request.acquistatoPressoDiNoi,
            seriale: request.seriale,
            imei: request.imei,
            codiceModello: request.codiceModello,
            testDiagnostici: request.testDiagnostici,
            lasciatoInNegozio: request.lasciatoInNegozio,
        }).where(eq(products.id, id)).returning();

        return ProductMapper.toResponse(updated, modelRow.models, modelRow.brands, color);
    }

    async delete(id: number): Promise<void> {
        const result = await db.select().from(products).where(eq(products.id, id));
        const product = result.at(0);
        if (!product) throw new HttpError(HttpStatus.NOT_FOUND, "Prodotto non trovato");

        if (product.repairId != null)
            throw new HttpError(HttpStatus.CONFLICT, "Impossibile eliminare: il prodotto è collegato a una riparazione");

        await db.delete(products).where(eq(products.id, id));
    }

}
