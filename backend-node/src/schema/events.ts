import { pgTable, bigserial, varchar, date, time } from 'drizzle-orm/pg-core'

export const events = pgTable('events', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    descrizione: varchar('descrizione', { length: 500 }).notNull(),
    dataEvento: date('data_evento').notNull(),
    oraInizio: time('ora_inizio').notNull(),
    oraFine: time('ora_fine').notNull(),
})
