import bcrypt from "bcryptjs";
import { LoginRequest, LoginResponse, RegisterRequest } from "../dto/auth.dto";
import { db } from "../config/db";
import { refreshTokens, users } from "../schema";
import { eq } from "drizzle-orm";
import { HttpStatus } from "../common/httpStatus";
import { HttpError } from "../common/httpError";
import { generateAccessToken, generateRefreshToken, extractRefreshTokenFromCookies, clearRefreshTokenCookie } from "../common/token";
import { Request, Response } from "express";
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
        if (!result.length) throw new HttpError(HttpStatus.UNAUTHORIZED, "Credenziali non valide");

        const utente = result.at(0)!;

        const passwordValida = await bcrypt.compare(request.password, utente.passwordHash);
        if (!passwordValida) throw new HttpError(HttpStatus.UNAUTHORIZED, "Credenziali non valide");

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
            maxAge: days * 24 * 60 * 60 * 1000
        });

        return { accessToken };
    }

    async logout(req: Request, res: Response): Promise<void> {
        const refreshTokenValue = extractRefreshTokenFromCookies(req);

        const result = await db.select().from(refreshTokens).where(eq(refreshTokens.token, refreshTokenValue));
        const token = result.at(0);

        if (!token || token.revoked) {
            clearRefreshTokenCookie(res);
            return;
        }

        await db.update(refreshTokens)
            .set({ revoked: true })
            .where(eq(refreshTokens.token, refreshTokenValue));

        clearRefreshTokenCookie(res);
    }

    async refresh(req: Request, res: Response): Promise<LoginResponse> {
        const refreshTokenValue = extractRefreshTokenFromCookies(req);
        const tokenResult = await db.select().from(refreshTokens).where(eq(refreshTokens.token, refreshTokenValue));
        const refreshToken = tokenResult.at(0);

        if (!refreshToken) {
            clearRefreshTokenCookie(res);
            throw new HttpError(HttpStatus.UNAUTHORIZED, "Refresh token not found");
        }

        if (refreshToken.revoked || refreshToken.expiresAt < new Date()) {
            await this.logout(req, res);
            throw new HttpError(HttpStatus.UNAUTHORIZED, "Refresh token scaduto o revocato");
        }

        const userResult = await db.select().from(users).where(eq(users.id, refreshToken.userId));
        const user = userResult.at(0);

        if (!user) {
            await this.logout(req, res);
            throw new HttpError(HttpStatus.UNAUTHORIZED, "Nessun utente associato a questo token");
        }

        await db.update(refreshTokens)
            .set({ revoked: true })
            .where(eq(refreshTokens.token, refreshTokenValue));

        const newRefreshToken = generateRefreshToken();

        await db.insert(refreshTokens).values({
            userId: user.id,
            token: newRefreshToken,
            expiresAt: refreshToken.expiresAt,
            revoked: false
        });

        const remainingMs = refreshToken.expiresAt.getTime() - Date.now();

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: cookieConfig.secure,
            path: "/api/auth",
            sameSite: cookieConfig.sameSite,
            maxAge: remainingMs
        });

        const accessToken = generateAccessToken({ sub: user.username, role: user.role });

        return { accessToken };
    }
}