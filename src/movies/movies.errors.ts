import { NextFunction, Request, Response } from "express";

export class MovieNotFoundError extends Error {
    constructor(movieId: number) {
        super(`Movie not found. ID: ${movieId}`);
    }
}

export class MovieIdInvalidError extends Error {
    constructor(id: string) {
        super(`Invalid movie ID: ${id}`);
    }
}

export function handleMovieErrors(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    if (err instanceof MovieNotFoundError) {
        return res.status(404).json({ error: err.message })
    }
    if (err instanceof MovieIdInvalidError) {
        return res.status(400).json({ error: err.message })
    }

    next(err);
}
