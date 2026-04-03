import { and, count, eq, ilike, inArray, isNull, ne, SQL } from "drizzle-orm";
import { db } from "../config/db";
import {
    CreateRepairRequest,
    PageResponse,
    RepairResponse,
    StatoRepair,
    StatoRiparazione,
    UpdateRepairRequest,
    UpdateStatoRepairRequest,
} from "../dto/repair.dto";
import { RepairMapper } from "../mapper/repair.mapper";
import { RepairDetailsMapper } from "../mapper/repairDetails.mapper";
import { repairs } from "../schema/repairs";
import { customers } from "../schema/customers";
import { products } from "../schema/products";
import { models } from "../schema/models";
import { brands } from "../schema/brands";
import { colors } from "../schema/colors";
import { repairDetails } from "../schema/repairDetails";
import { repairDetailsInterventions } from "../schema/repairDetailsInterventions";
import { repairMessages } from "../schema/repairMessages";
import { interventions } from "../schema/interventions";
import { HttpError } from "../common/httpError";
import { HttpStatus } from "../common/httpStatus";

export class RepairService {

    private async buildRepairResponse(repair: typeof repairs.$inferSelect): Promise<RepairResponse> {
        const customerRows = await db.select().from(customers).where(eq(customers.id, repair.customerId));
        const customer = customerRows.at(0)!;

        const productRows = await db.select().from(products)
            .innerJoin(models, eq(products.modelId, models.id))
            .innerJoin(brands, eq(models.brandId, brands.id))
            .innerJoin(colors, eq(products.colorId, colors.id))
            .where(eq(products.repairId, repair.id));
        const productRow = productRows.at(0)!;

        const detailsRows = await db.select().from(repairDetails).where(eq(repairDetails.repairId, repair.id));
        const details = detailsRows.at(0)!;

        const rdiRows = await db.select().from(repairDetailsInterventions)
            .innerJoin(interventions, eq(repairDetailsInterventions.interventionId, interventions.id))
            .where(eq(repairDetailsInterventions.repairDetailsId, details.id));
        const interventi = rdiRows.map(r =>
            RepairDetailsMapper.toInterventionQuantita(r.repair_details_interventions, r.interventions)
        );

        const messaggiRows = await db.select().from(repairMessages)
            .where(eq(repairMessages.repairDetailsId, details.id));
        const messaggi = messaggiRows.map(m => RepairDetailsMapper.toMessage(m));

        return RepairMapper.toResponse(
            repair, customer,
            productRow.products, productRow.models, productRow.brands, productRow.colors,
            details, interventi, messaggi
        );
    }

    private async findRepairById(id: number) {
        const result = await db.select().from(repairs).where(eq(repairs.id, id));
        const repair = result.at(0);
        if (!repair) throw new HttpError(HttpStatus.NOT_FOUND, "Riparazione non trovata");
        return repair;
    }

    private async paginatedQuery(where: SQL | undefined, page: number, size: number): Promise<PageResponse<RepairResponse>> {
        const offset = page * size;

        const [{ total }] = await db.select({ total: count() }).from(repairs).where(where);

        const rows = await db.select().from(repairs)
            .where(where)
            .limit(size)
            .offset(offset);

        const content = await Promise.all(rows.map(r => this.buildRepairResponse(r)));

        return {
            content,
            totalElements: total,
            totalPages: Math.ceil(total / size),
            size,
            number: page,
        };
    }

    async create(request: CreateRepairRequest, autore: string): Promise<RepairResponse> {
        return db.transaction(async (tx) => {

            // 1. Customer: aggiorna se customerId fornito, altrimenti crea
            let customer;
            if (request.customerId != null) {
                const existing = await tx.select().from(customers).where(eq(customers.id, request.customerId));
                if (!existing.at(0)) throw new HttpError(HttpStatus.NOT_FOUND, "Cliente non trovato");
                const [updated] = await tx.update(customers).set({ ...request.customer })
                    .where(eq(customers.id, request.customerId)).returning();
                customer = updated;
            } else {
                const [saved] = await tx.insert(customers).values({ ...request.customer }).returning();
                customer = saved;
            }

            // 2. Crea repair con stato iniziale
            const [repair] = await tx.insert(repairs).values({
                customerId: customer.id,
                stato: 'NUOVO',
                statoRiparazione: request.details.isPreventivo ? 'IN_ATTESA_DI_PREVENTIVO' : 'ACCETTATO',
                createdAt: new Date(),
            }).returning();

            // 3. Trova o crea model e color per il product
            const modelRows = await tx.select().from(models)
                .innerJoin(brands, eq(models.brandId, brands.id))
                .where(ilike(models.nome, request.product.model.nome));
            let modelRow = modelRows.at(0);

            if (!modelRow) {
                const brandRows = await tx.select().from(brands).where(ilike(brands.nome, request.product.model.brandNome));
                const brand = brandRows.at(0);
                if (!brand) throw new HttpError(HttpStatus.NOT_FOUND, "Brand non trovato");
                const [newModel] = await tx.insert(models).values({
                    nome: request.product.model.nome,
                    tipoDispositivo: request.product.model.tipoDispositivo,
                    brandId: brand.id,
                }).returning();
                modelRow = { models: newModel, brands: brand };
            }

            const colorRows = await tx.select().from(colors).where(ilike(colors.nome, request.product.color.nome));
            let color = colorRows.at(0);
            if (!color) {
                const [newColor] = await tx.insert(colors).values({ nome: request.product.color.nome }).returning();
                color = newColor;
            }

            // 4. Crea product collegato alla repair
            const [product] = await tx.insert(products).values({
                repairId: repair.id,
                modelId: modelRow.models.id,
                colorId: color.id,
                capacita: request.product.capacita,
                codiceUnlock: request.product.codiceUnlock,
                sequenzaUnlock: request.product.sequenzaUnlock ? JSON.stringify(request.product.sequenzaUnlock) : null,
                pin: request.product.pin,
                accessori: request.product.accessori,
                contattoConLiquidi: request.product.contattoConLiquidi,
                dispositivoNonTestabile: request.product.dispositivoNonTestabile,
                acquistatoPressoDiNoi: request.product.acquistatoPressoDiNoi,
                seriale: request.product.seriale,
                imei: request.product.imei,
                codiceModello: request.product.codiceModello,
                testDiagnostici: request.product.testDiagnostici,
                lasciatoInNegozio: request.product.lasciatoInNegozio,
            }).returning();

            // 5. Crea repairDetails
            const [details] = await tx.insert(repairDetails).values({
                repairId: repair.id,
                isPreventivo: request.details.isPreventivo,
                dataConsegna: request.details.dataConsegna ? new Date(request.details.dataConsegna) : null,
                acconto: request.details.acconto != null ? String(request.details.acconto) : null,
            }).returning();

            for (const i of request.details.interventi) {
                await tx.insert(repairDetailsInterventions).values({
                    repairDetailsId: details.id,
                    interventionId: i.interventionId,
                    quantita: i.quantita,
                });
            }

            if (request.details.messaggi?.length) {
                await tx.insert(repairMessages).values(
                    request.details.messaggi.map(m => ({
                        repairDetailsId: details.id,
                        testo: m.testo,
                        autore,
                        createdAt: new Date(),
                    }))
                );
            }

            // 6. Calcola costoTotale
            let costoTotale = 0;
            let interventionsData: typeof interventions.$inferSelect[] = [];
            if (request.details.interventi.length > 0) {
                const ids = request.details.interventi.map(i => i.interventionId);
                interventionsData = await tx.select().from(interventions).where(inArray(interventions.id, ids));
                costoTotale = request.details.interventi.reduce((sum, rdi) => {
                    const intervention = interventionsData.find(i => i.id === rdi.interventionId);
                    if (!intervention) return sum;
                    return sum + parseFloat(intervention.prezzo) * rdi.quantita;
                }, 0);
            }

            const [updatedRepair] = await tx.update(repairs)
                .set({ costoTotale: String(costoTotale) })
                .where(eq(repairs.id, repair.id)).returning();

            // 7. Costruisci response dai dati già in memoria
            const interventi = request.details.interventi.map(rdi => {
                const intervention = interventionsData.find(i => i.id === rdi.interventionId)!;
                return RepairDetailsMapper.toInterventionQuantita(
                    { id: 0, repairDetailsId: details.id, interventionId: rdi.interventionId, quantita: rdi.quantita },
                    intervention
                );
            });

            const messaggiRows = request.details.messaggi?.length
                ? await tx.select().from(repairMessages).where(eq(repairMessages.repairDetailsId, details.id))
                : [];
            const messaggi = messaggiRows.map(m => RepairDetailsMapper.toMessage(m));

            return RepairMapper.toResponse(
                updatedRepair, customer,
                product, modelRow.models, modelRow.brands, color,
                details, interventi, messaggi
            );
        });
    }

    async getAll(page = 0, size = 20): Promise<PageResponse<RepairResponse>> {
        return this.paginatedQuery(undefined, page, size);
    }

    async search(stato?: StatoRepair, statoRiparazione?: StatoRiparazione, page = 0, size = 20): Promise<PageResponse<RepairResponse>> {
        const filters: SQL[] = [];
        if (stato) filters.push(eq(repairs.stato, stato));
        if (statoRiparazione) filters.push(eq(repairs.statoRiparazione, statoRiparazione));
        return this.paginatedQuery(filters.length > 0 ? and(...filters) : undefined, page, size);
    }

    async getAttive(): Promise<RepairResponse[]> {
        const rows = await db.select().from(repairs).where(ne(repairs.stato, 'CONSEGNATO'));
        return Promise.all(rows.map(r => this.buildRepairResponse(r)));
    }

    async getSenzaDataRiconsegnaStiamata(): Promise<RepairResponse[]> {
        const rows = await db
            .select({ repair: repairs })
            .from(repairs)
            .innerJoin(repairDetails, eq(repairDetails.repairId, repairs.id))
            .where(and(isNull(repairDetails.dataConsegna), isNull(repairDetails.dataRiconsegnaEffettiva)));
        return Promise.all(rows.map(r => this.buildRepairResponse(r.repair)));
    }

    async getById(id: number): Promise<RepairResponse> {
        const repair = await this.findRepairById(id);
        return this.buildRepairResponse(repair);
    }

    async update(id: number, request: UpdateRepairRequest): Promise<RepairResponse> {
        await this.findRepairById(id);

        const customerRows = await db.select().from(customers).where(eq(customers.id, request.customerId));
        if (!customerRows.at(0)) throw new HttpError(HttpStatus.NOT_FOUND, "Cliente non trovato");

        const [updated] = await db.update(repairs).set({
            customerId: request.customerId,
            stato: request.stato,
            statoRiparazione: request.statoRiparazione,
        }).where(eq(repairs.id, id)).returning();

        return this.buildRepairResponse(updated);
    }

    async updateStato(id: number, request: UpdateStatoRepairRequest): Promise<RepairResponse> {
        await this.findRepairById(id);

        const updates: Partial<typeof repairs.$inferInsert> = {};
        if (request.stato) {
            updates.stato = request.stato;

            if (request.stato === 'CONSEGNATO') {
                const detailsRows = await db.select().from(repairDetails).where(eq(repairDetails.repairId, id));
                const details = detailsRows.at(0);
                if (details && details.dataRiconsegnaEffettiva == null) {
                    await db.update(repairDetails)
                        .set({ dataRiconsegnaEffettiva: new Date() })
                        .where(eq(repairDetails.id, details.id));
                }
            }
        }
        if (request.statoRiparazione) updates.statoRiparazione = request.statoRiparazione;

        const [updated] = await db.update(repairs).set(updates).where(eq(repairs.id, id)).returning();
        return this.buildRepairResponse(updated);
    }

    async delete(id: number): Promise<void> {
        const repair = await this.findRepairById(id);

        const detailsRows = await db.select().from(repairDetails).where(eq(repairDetails.repairId, repair.id));
        const details = detailsRows.at(0);

        if (details) {
            await db.delete(repairMessages).where(eq(repairMessages.repairDetailsId, details.id));
            await db.delete(repairDetailsInterventions).where(eq(repairDetailsInterventions.repairDetailsId, details.id));
            await db.delete(repairDetails).where(eq(repairDetails.id, details.id));
        }

        await db.delete(products).where(eq(products.repairId, repair.id));
        await db.delete(repairs).where(eq(repairs.id, repair.id));
    }
}
