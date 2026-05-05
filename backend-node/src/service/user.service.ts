import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { UserResponse, UpdateUserRequest } from "../dto/user.dto";
import { UserMapper } from "../mapper/user.mapper";
import { users } from "../schema/users";
import { HttpError } from "../common/httpError";
import { HttpStatus } from "../common/httpStatus";

export class UserService {

    async getByUsername(username: string): Promise<UserResponse> {
        const result = await db.select().from(users).where(eq(users.username, username));
        const user = result.at(0);
        if (!user) throw new HttpError(HttpStatus.NOT_FOUND, "Utente non trovato");
        return UserMapper.toResponse(user);
    }

    async update(username: string, request: UpdateUserRequest): Promise<UserResponse> {
        const result = await db.select().from(users).where(eq(users.username, username));
        if (!result.at(0)) throw new HttpError(HttpStatus.NOT_FOUND, "Utente non trovato");

        const updates: Partial<typeof users.$inferInsert> = {};
        if (request.nome) updates.nome = request.nome;
        if (request.email) updates.email = request.email;
        if (request.password) updates.passwordHash = await bcrypt.hash(request.password, 10);

        const [updated] = await db.update(users).set(updates).where(eq(users.username, username)).returning();
        return UserMapper.toResponse(updated);
    }

}
