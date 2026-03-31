import { pgTable, bigserial, varchar, bigint } from 'drizzle-orm/pg-core'
import { brands } from './brands'

export type TipoDispositivo = 'TELEFONO' | 'TABLET' | 'COMPUTER'

export const models = pgTable('models', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    nome: varchar('nome', { length: 255 }).notNull().unique(),
    tipoDispositivo: varchar('tipo_dispositivo', { length: 50 }).notNull().$type<TipoDispositivo>(),
    brandId: bigint('brand_id', { mode: 'number' }).notNull().references(() => brands.id),
})
