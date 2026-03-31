import { NextFunction, Request, Response } from "express";
import { ValidateError } from "tsoa";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof ValidateError) {
    res.status(422).json({
      message: "Validation error",
      details: err.fields,
    });
    return;
  }

  if (err instanceof Error) {
    res.status(500).json({ message: err.message });
    return;
  }

  next(err);
}
