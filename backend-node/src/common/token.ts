import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "../dto/auth.dto";

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
