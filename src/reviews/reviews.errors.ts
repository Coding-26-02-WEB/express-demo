import { NextFunction, Request, Response } from "express";

export class ReviewDataInvalidError extends Error {
    constructor(reason: string) {
        super(`Invalid review data. ${reason}`);
    }
}

export class ReviewBookNotFoundError extends Error {
    constructor(bookId: number) {
        super(`Book not found. ID: ${bookId}`);
    }
}

export class ReviewNotFoundError extends Error {
    constructor(reviewId: number) {
        super(`Review not found. ID: ${reviewId}`);
    }
}

export function handleReviewErrors(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    if (err instanceof ReviewDataInvalidError) {
        return res.status(400).json({ error: err.message });
    }
    if (err instanceof ReviewBookNotFoundError || err instanceof ReviewNotFoundError) {
        return res.status(404).json({ error: err.message });
    }

    next(err);
}
