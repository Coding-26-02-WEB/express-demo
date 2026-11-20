import { NextFunction, Request, Response } from "express";

export class BookNotFoundError extends Error {
    constructor(bookId: number) {
        super(`Book not found. ID: ${bookId}`);
        
        //Seit neuestem optional...
        // this.name = new.target.name;
    }
}

export class MissingSearchQueryError extends Error {
    constructor() {
        super("Search query is missing.");
    }
}

export class InvalidSearchLimitError extends Error {
    constructor() {
        super("Search limit must be a positive integer.");
    }
}

export class BookSearchFailedError extends Error {
    constructor() {
        super("Book search failed.");
    }
}

export function handleBookErrors(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    if (err instanceof BookNotFoundError) {
        return res.status(404).json({ error: err.message })
    }
    if (err instanceof MissingSearchQueryError || err instanceof InvalidSearchLimitError) {
        return res.status(400).json({ error: err.message })
    }
    if (err instanceof BookSearchFailedError) {
        return res.status(502).json({ error: err.message })
    }

    next(err);
}