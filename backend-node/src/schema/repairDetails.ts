import { bigserial, boolean, numeric, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'
import { repairs } from './repairs'

export const repairDetails = pgTable('repair_details', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    repairId: varchar('repair_id', { length: 6 }).notNull().unique().references(() => repairs.id),
    isPreventivo: boolean('is_preventivo').notNull(),
    dataConsegna: timestamp('data_consegna'),
    dataRiconsegnaEffettiva: timestamp('data_riconsegna_effettiva'),
    acconto: numeric('acconto', { precision: 38, scale: 2 }),
})
