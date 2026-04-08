import { pgTable, bigserial, bigint, varchar, text, boolean, jsonb } from 'drizzle-orm/pg-core'
import { repairs } from './repairs'
import { models } from './models'
import { colors } from './colors'

export const products = pgTable('products', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    repairId: varchar('repair_id', { length: 6 }).references(() => repairs.id),
    modelId: bigint('model_id', { mode: 'number' }).notNull().references(() => models.id),
    colorId: bigint('color_id', { mode: 'number' }).notNull().references(() => colors.id),
    capacita: varchar('capacita', { length: 255 }),
    codiceUnlock: varchar('codice_unlock', { length: 255 }),
    sequenzaUnlock: text('sequenza_unlock'),
    pin: varchar('pin', { length: 255 }),
    accessori: varchar('accessori', { length: 255 }),
    contattoConLiquidi: boolean('contatto_con_liquidi'),
    dispositivoNonTestabile: boolean('dispositivo_non_testabile'),
    acquistatoPressoDiNoi: boolean('acquistato_presso_di_noi'),
    seriale: varchar('seriale', { length: 255 }),
    imei: varchar('imei', { length: 255 }),
    codiceModello: varchar('codice_modello', { length: 255 }),
    lasciatoInNegozio: boolean('lasciato_in_negozio'),
    testDiagnostici: jsonb('test_diagnostici'),
})
