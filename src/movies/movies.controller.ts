import { Response, Request, NextFunction } from "express";
import { getAllMovies, getMovieById } from "./movies.service";
import { sendSuccess } from "../utils/sendSuccess";

export async function getMoviesHandler(req: Request, res: Response, next: NextFunction) {
    try {
        sendSuccess(res, await getAllMovies())
    } catch (error) {
        next(error);
    }
}

export async function getMovieHandler(req: Request, res: Response, next: NextFunction) {
    try {
        sendSuccess(res, await getMovieById(Number(req.params.id)));
    } catch (error) {
        next(error);
    }
}
