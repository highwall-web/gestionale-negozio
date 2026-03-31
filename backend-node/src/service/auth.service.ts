import bcrypt from "bcryptjs";
import { LoginRequest, LoginResponse, RegisterRequest } from "../dto/auth.dto";
import { db } from "../config/db";
import { refreshTokens, users } from "../schema";
import { eq } from "drizzle-orm";
import { HttpStatus } from "../common/httpStatus";
import { generateAccessToken, generateRefreshToken } from "../common/token";
import { Response } from "express";
import { cookieConfig } from "../config/cookie";

export class AuthService {
    async register(request: RegisterRequest): Promise<void> {
        const passwordHash = await bcrypt.hash(request.password, 10);

        await db.insert(users).values({
            username: request.username,
            nome: request.nome,
            passwordHash,
            email: request.email,
            role: request.role,
            enabled: true
        })
    }

    async login(request: LoginRequest, res: Response): Promise<LoginResponse> {
        const result = await db.select().from(users).where(eq(users.username, request.username));
        if (!result.length) throw { status: HttpStatus.UNAUTHORIZED, message: "Credenziali non valide" };

        const utente = result.at(0)!;

        const passwordValida = await bcrypt.compare(request.password, utente.passwordHash);
        if (!passwordValida) throw { status: HttpStatus.UNAUTHORIZED, message: "Credenziali non valide" };

        const accessToken: string = generateAccessToken({ sub: utente.username, role: utente.role });
        const refreshToken: string = generateRefreshToken();
        const rememberMe: boolean = request.rememberMe;

        const days = rememberMe ? cookieConfig.rememberMeDays : cookieConfig.defaultDays;

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + days);

        await db.insert(refreshTokens).values({
            userId: utente.id,
            token: refreshToken,
            expiresAt,
            revoked: false
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: cookieConfig.secure,
            path: "/api/auth",
            sameSite: cookieConfig.sameSite,
            maxAge: days * 24 * 60 * 60
        });

        return { accessToken };
    }
}