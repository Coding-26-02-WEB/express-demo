import { NextFunction, Request, Response } from "express";

export class BookNotFoundError extends Error {
    constructor(bookId: number) {
        super(`Book not found. ID: ${bookId}`);
        
        //Seit neuestem optional...
        // this.name = new.target.name;
    }
}

export class MissingQueryError extends Error {
    constructor() {
        super("No search query provided. Use ?query=<begriff>.");
    }
}

export class BookSearchFailedError extends Error {
    constructor(query: string, reason: string) {
        super(`Book search for "${query}" failed: ${reason}`);
    }
}

export function handleBookErrors(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    if (err instanceof BookNotFoundError) {
        return res.status(404).json({ error: err.message })
    }
    if (err instanceof MissingQueryError) {
        return res.status(400).json({ error: err.message })
    }
    if (err instanceof BookSearchFailedError) {
        return res.status(502).json({ error: err.message })
    }

    next(err);
}