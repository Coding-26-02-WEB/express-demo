import { NextFunction, Request, Response } from "express";

export class BookNotFoundError extends Error {
    constructor(bookId: number) {
        super(`Book not found. ID: ${bookId}`);
        
        //Seit neuestem optional...
        // this.name = new.target.name;
    }
}

export class BookSearchQueryMissingError extends Error {
    constructor() {
        super("The search query is missing.")
    }
}

export class BookSearchFailedError extends Error {
    constructor(query: string) {
        super(`The book search for "${query}" failed.`)
    }
}

export function handleBookErrors(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    if (err instanceof BookNotFoundError) {
        return res.status(404).json({ error: err.message })
    }

    next(err);
}