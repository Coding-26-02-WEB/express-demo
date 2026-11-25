import { Response, Request, NextFunction } from "express";
import { getAllMovies, getMovieById } from "./movies.service.ts";
import { sendSuccess } from "../utils/sendSuccess.ts";
import { InvalidMovieIdError } from "./movies.errors.ts";

export async function getMoviesHandler(req: Request, res: Response, next: NextFunction) {
    try {
        sendSuccess(res, await getAllMovies())
    } catch (error) {
        next(error);
    }
}

export async function getMovieHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) throw new InvalidMovieIdError(String(req.params.id));
        sendSuccess(res, await getMovieById(id));
    } catch (error) {
        next(error);
    }
}
