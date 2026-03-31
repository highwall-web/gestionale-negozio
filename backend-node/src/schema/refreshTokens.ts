import { pgTable, bigserial, varchar, bigint, timestamp, boolean } from 'drizzle-orm/pg-core'
import { users } from './users'

export const refreshTokens = pgTable('refresh_tokens', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    token: varchar('token', { length: 512 }).notNull().unique(),
    userId: bigint('user_id', { mode: 'number' }).notNull().references(() => users.id),
    expiresAt: timestamp('expires_at').notNull(),
    revoked: boolean('revoked').notNull(),
})
