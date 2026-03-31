import { pgTable, bigserial, varchar } from 'drizzle-orm/pg-core'

export const customers = pgTable('customers', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    nome: varchar('nome', { length: 255 }).notNull(),
    cognome: varchar('cognome', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    indirizzo: varchar('indirizzo', { length: 255 }),
    citta: varchar('citta', { length: 255 }),
    cap: varchar('cap', { length: 255 }),
    telefono: varchar('telefono', { length: 255 }).notNull(),
    telefonoSecondario: varchar('telefono_secondario', { length: 255 }),
})
