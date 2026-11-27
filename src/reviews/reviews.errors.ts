import { NextFunction, Request, Response } from "express";
import { BookNotFoundError } from "../books/books.errors.ts";

export class ReviewNotFoundError extends Error {
    constructor(reviewId: number) {
        super(`Review not found. ID: ${reviewId}`);
    }
}

export class InvalidReviewInputError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export function handleReviewErrors(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    if (err instanceof BookNotFoundError || err instanceof ReviewNotFoundError) {
        return res.status(404).json({ error: err.message });
    }
    if (err instanceof InvalidReviewInputError) {
        return res.status(400).json({ error: err.message });
    }
    next(err);
}
