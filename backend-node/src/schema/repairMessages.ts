import { bigint, bigserial, boolean, numeric, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { repairDetails } from './repairDetails'

export const repairMessages = pgTable('repair_messages', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    repairDetailsId: bigint('repair_details_id', { mode: 'number' }).notNull().references(() => repairDetails.id),
    testo: text('testo').notNull(),
    autore: varchar('autore', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').notNull(),
})