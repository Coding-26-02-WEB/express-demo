import { Response, Request, NextFunction } from "express";
import { getAllMovies, getMovieById } from "./movies.service";

export async function getMoviesHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await getAllMovies();
        res.status(200).json({
            success: true,
            data: data,
            count: data.length
        })
    } catch (error) {
        next(error);
    }
}

export async function getMovieHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const movie = await getMovieById(Number(req.params.id));

        res.status(200).json({
            success: true,
            data: movie
        })
    } catch (error) {
        next(error);
    }
}
