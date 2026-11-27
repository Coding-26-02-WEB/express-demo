import { NextFunction, Request, Response } from "express";
import { BookNotFoundError } from "../books/books.errors.ts";

export class ReviewNotFoundError extends Error {
    constructor(reviewId: number, bookId: number) {
        super(`Review not found. ID: ${reviewId}, Book ID: ${bookId}`);
    }
}

export class ReviewDataInvalidError extends Error {
    constructor(reason: string) {
        super(`Invalid review data. ${reason}`)
    }
}

export class ReviewIdInvalidError extends Error {
    constructor(id: string) {
        super(`Invalid ID: ${id}. It must be a positive integer.`)
    }
}

export function handleReviewErrors(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    if (err instanceof BookNotFoundError || err instanceof ReviewNotFoundError) {
        return res.status(404).json({ error: err.message })
    }
    if (err instanceof ReviewDataInvalidError || err instanceof ReviewIdInvalidError) {
        return res.status(400).json({ error: err.message })
    }

    next(err);
}
