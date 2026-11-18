import { NextFunction, Request, Response } from "express";

export class MovieNotFoundError extends Error {
    constructor(movieId: number) {
        super(`Movie not found. ID: ${movieId}`);
    }
}

export function handleMovieErrors(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    if (err instanceof MovieNotFoundError) {
        return res.status(404).json({ error: err.message })
    }

    next(err);
}
