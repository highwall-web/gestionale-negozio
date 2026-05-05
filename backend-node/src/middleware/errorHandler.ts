import { NextFunction, Request, Response } from "express";
import { ValidateError } from "tsoa";
import { HttpError } from "../common/httpError";

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    next: NextFunction
): void {
    if (err instanceof ValidateError) {
        console.error("[Error]", err.message, (err as any).cause ?? "");
        res.status(422).json({
            message: "Validation error",
            details: err.fields,
        });
        return;
    }

    if (err instanceof HttpError) {
        console.error("[Error]", err.message, (err as any).cause ?? "");
        res.status(err.status).json({ message: err.message });
        return;
    }

    if (err instanceof Error) {
        console.error("[Error]", err.message, (err as any).cause ?? "");
        res.status(500).json({ message: err.message });
        return;
    }

    next(err);
}
