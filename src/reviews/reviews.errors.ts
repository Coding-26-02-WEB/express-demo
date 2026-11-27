import { NextFunction, Request, Response } from "express";
import { BookNotFoundError } from "../books/books.errors.ts";

export class InvalidReviewError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class ReviewNotFoundError extends Error {
    constructor(reviewId: number) {
        super(`Review not found. ID: ${reviewId}`);
    }
}

export function handleReviewErrors(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    if (err instanceof InvalidReviewError) {
        return res.status(400).json({ error: err.message });
    }
    if (err instanceof ReviewNotFoundError || err instanceof BookNotFoundError) {
        return res.status(404).json({ error: err.message });
    }

    next(err);
}
