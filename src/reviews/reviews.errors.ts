import { NextFunction, Request, Response } from "express";
import { BookNotFoundError } from "../books/books.errors.ts";

export class ReviewNotFoundError extends Error {
    constructor(bookId: number, reviewId: number) {
        super(`Review not found. Book ID: ${bookId}, Review ID: ${reviewId}`);
    }
}

export class ReviewIdInvalidError extends Error {
    constructor(name: string, value: string) {
        super(`Invalid ${name}: ${value}`);
    }
}

export class ReviewDataInvalidError extends Error {
    constructor(reason: string) {
        super(`Invalid review data. ${reason}`);
    }
}

export function handleReviewErrors(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    if (err instanceof ReviewNotFoundError) {
        return res.status(404).json({ error: err.message })
    }
    // Der Reviews-Router läuft nicht durch handleBookErrors, deshalb hier mit abbilden
    if (err instanceof BookNotFoundError) {
        return res.status(404).json({ error: err.message })
    }
    if (err instanceof ReviewIdInvalidError) {
        return res.status(400).json({ error: err.message })
    }
    if (err instanceof ReviewDataInvalidError) {
        return res.status(400).json({ error: err.message })
    }

    next(err);
}
