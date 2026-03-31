import { pgTable, bigserial, varchar } from 'drizzle-orm/pg-core'

export const colors = pgTable('colors', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    nome: varchar('nome', { length: 255 }).notNull().unique(),
})
