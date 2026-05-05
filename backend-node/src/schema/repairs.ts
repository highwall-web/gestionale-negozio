import { pgTable, bigint, varchar, numeric, timestamp } from 'drizzle-orm/pg-core'
import { randomBytes } from 'crypto'

function generateRepairId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const bytes = randomBytes(6)
    return Array.from(bytes).map(b => chars[b % chars.length]).join('')
}
import { customers } from './customers'

export type StatoRepair = 'NUOVO' | 'IN_CORSO' | 'PRONTO' | 'CONSEGNATO'

export type StatoRiparazione =
    | 'ACCETTATO'
    | 'ANALISI_IN_CORSO'
    | 'RIPARAZIONE_IN_CORSO'
    | 'ATTESA_PEZZI_DI_RICAMBIO'
    | 'IN_ATTESA_DI_PREVENTIVO'
    | 'PREVENTIVO_NON_ACCETTATO'
    | 'RIPARAZIONE_CONCLUSA'
    | 'DISPOSITIVO_NON_RIPARABILE'

export const repairs = pgTable('repairs', {
    id: varchar('id', { length: 6 }).primaryKey().$defaultFn(generateRepairId),
    customerId: bigint('customer_id', { mode: 'number' }).notNull().references(() => customers.id),
    stato: varchar('stato', { length: 50 }).$type<StatoRepair>(),
    statoRiparazione: varchar('stato_riparazione', { length: 100 }).$type<StatoRiparazione>(),
    costoTotale: numeric('costo_totale', { precision: 38, scale: 2 }),
    createdAt: timestamp('created_at').notNull(),
})
