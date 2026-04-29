import { bigint, bigserial, integer, numeric, pgTable } from "drizzle-orm/pg-core";
import { interventions } from "./interventions";
import { repairDetails } from "./repairDetails";

export const repairDetailsInterventions = pgTable('repair_details_interventions', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    repairDetailsId: bigint('repair_details_id', { mode: 'number' }).notNull().references(() => repairDetails.id),
    interventionId: bigint('intervention_id', { mode: 'number' }).notNull().references(() => interventions.id),
    quantita: integer('quantita').notNull(),
    prezzoUnitario: numeric('prezzo_unitario', { precision: 38, scale: 2 }).notNull(),
})