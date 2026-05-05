import { pgTable, bigserial, bigint, varchar, numeric, integer, boolean } from 'drizzle-orm/pg-core'
import { models } from './models'

export const interventions = pgTable('interventions', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    modelId: bigint('model_id', { mode: 'number' }).references(() => models.id),
    nome: varchar('nome', { length: 255 }).notNull(),
    prezzo: numeric('prezzo', { precision: 38, scale: 2 }).notNull(),
    periodoGaranzia: integer('periodo_garanzia'),
    attivo: boolean('attivo').notNull().default(true),
})
