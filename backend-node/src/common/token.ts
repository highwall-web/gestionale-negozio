import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "../dto/auth.dto";
import { HttpStatus } from "./httpStatus";
import { HttpError } from "./httpError";
import { cookieConfig } from "../config/cookie";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const ACCESS_EXPIRY = "15m";

export interface AccessTokenPayload extends JwtPayload {
    role: Role;
}

export function generateAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY });
}

export function generateRefreshToken(): string {
    return crypto.randomUUID() + "-" + crypto.randomUUID();
}

export function verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, ACCESS_SECRET) as AccessTokenPayload;
}

export function clearRefreshTokenCookie(res: { clearCookie: (name: string, options?: object) => void }): void {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: cookieConfig.secure,
        path: "/api/auth",
        sameSite: cookieConfig.sameSite
    });
}

export function extractRefreshTokenFromCookies(req: { cookies?: Record<string, string> }): string {
    if (!req.cookies) throw new HttpError(HttpStatus.UNAUTHORIZED, "Nessun cookie trovato");
    const refreshToken = req.cookies["refreshToken"] ?? null;
    if (!refreshToken) throw new HttpError(HttpStatus.UNAUTHORIZED, "RefreshToken cookie non trovato");
    return refreshToken;
}
