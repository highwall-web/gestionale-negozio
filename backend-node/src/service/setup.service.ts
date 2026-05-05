import bcrypt from "bcryptjs";
import { db } from "../config/db";
import { users } from "../schema/users";
import { RegisterRequest } from "../dto/auth.dto";

export class SetupService {

    async setup(body: RegisterRequest): Promise<{ status: number; message: string }> {
        const existing = await db.select().from(users).limit(1);
        if (existing.length > 0) {
            return { status: 409, message: "Setup already completed" };
        }

        const passwordHash = await bcrypt.hash(body.password, 10);

        await db.insert(users).values({
            username: body.username,
            nome: body.nome,
            email: body.email,
            passwordHash,
            role: "ADMIN",
            enabled: true,
        });

        return { status: 201, message: "Admin user created" };
    }
}
