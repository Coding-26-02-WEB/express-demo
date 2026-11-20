import { NextFunction, Request, Response } from "express";

export class BookNotFoundError extends Error {
    constructor(bookId?: number) {
        super(`Book not found.${bookId ? ` ID: ${bookId}`: ""}`);
        
        //Seit neuestem optional...
        // this.name = new.target.name;
    }
}

export class ApiError extends Error {
    constructor(reason: string) {
        super(reason)
    }
}

export function handleBookErrors(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    if (err instanceof BookNotFoundError) {
        return res.status(404).json({ error: err.message })
    }

    if (err instanceof ApiError) {
        return res.status(500).json({ erro: err.message })
    }

    next(err);
}