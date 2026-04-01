import cron from "node-cron";
import { or, lt, eq } from "drizzle-orm";
import { db } from "../config/db";
import { refreshTokens } from "../schema";

export function scheduleTokenCleanup(): ReturnType<typeof cron.schedule> {
    return cron.schedule("0 3 * * *", async () => {
        try {
            await db.delete(refreshTokens).where(
                or(
                    lt(refreshTokens.expiresAt, new Date()),
                    eq(refreshTokens.revoked, true)
                )
            );
        } catch (err) {
            console.error("[TokenCleanup] Errore durante la pulizia dei token:", err);
        }
    });
}
