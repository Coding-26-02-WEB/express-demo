import { NextFunction, Request, Response } from "express";

export class BookNotFoundError extends Error {
    constructor(bookId: number) {
        super(`Book not found. ID: ${bookId}`);
    }
}

export class NoSearchQueryError extends Error {
    constructor() {
        super("A search query is required.");
    }
}

export class BookSearchNotFoundError extends Error {
    constructor(title: string) {
        super(`No books found with title: ${title}`);
    }
}

export function handleBookErrors(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    if (err instanceof BookNotFoundError) {
        return res.status(404).json({ error: err.message })
    }
    if (err instanceof NoSearchQueryError) {
        return res.status(400).json({ error: err.message });
    }
    if (err instanceof BookSearchNotFoundError) {
        return res.status(404).json({ error: err.message });
    }

    next(err);
}
