import { HttpStatus } from "./httpStatus";

export class HttpError extends Error {
    constructor(
        public readonly status: HttpStatus,
        message?: string
    ) {
        super(message);
        this.name = "HttpError";
    }
}
