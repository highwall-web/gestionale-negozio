import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { users } from "../schema/users";

export async function seedAdmin(): Promise<void> {
    console.log(process.env.NODE_ENV)
    if (process.env.NODE_ENV !== "development") return;

    const existing = await db.select().from(users).where(eq(users.username, "admin"));
    if (existing.length > 0) return;

    const passwordHash = await bcrypt.hash("admin123", 10);
    await db.insert(users).values({
        username: "admin",
        nome: "Mauro",
        email: "admin@admin.com",
        passwordHash,
        role: "ADMIN",
        enabled: true,
    });

    console.log("[Seeder] Admin creato: username=admin password=admin123");
}
