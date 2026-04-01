import { Request } from "express";
import { HttpError } from "../common/httpError";
import { HttpStatus } from "../common/httpStatus";
import { verifyAccessToken } from "../common/token";

export async function expressAuthentication(
    request: Request,
    securityName: string,
    scopes?: string[]
): Promise<unknown> {
    if (securityName !== "bearerAuth") {
        console.error("[Error]", "Schema di sicurezza non supportato");
        throw new HttpError(HttpStatus.UNAUTHORIZED, "Schema di sicurezza non supportato");
    }

    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        console.error("[Error]", "Token mancante");
        throw new HttpError(HttpStatus.UNAUTHORIZED, "Token mancante");
    }

    const token = authHeader.slice(7);
    let payload;
    try {
        payload = verifyAccessToken(token);
    } catch {
        throw new HttpError(HttpStatus.UNAUTHORIZED, "Token non valido o scaduto");
    }

    if (scopes?.length && !scopes.includes(payload.role)) {
        console.error("[Error]", "Permessi insufficienti");
        throw new HttpError(HttpStatus.FORBIDDEN, "Permessi insufficienti");
    }

    return payload;
}
