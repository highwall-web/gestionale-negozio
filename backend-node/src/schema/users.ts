import { pgTable, bigserial, varchar, boolean } from 'drizzle-orm/pg-core'

export type Role = 'ADMIN' | 'COMMESSO'

export const users = pgTable('users', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    username: varchar('username', { length: 255 }).notNull().unique(),
    nome: varchar('nome', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    role: varchar('role', { length: 50 }).notNull().$type<Role>(),
    enabled: boolean('enabled').notNull(),
})
