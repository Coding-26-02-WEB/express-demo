import { MovieNotFoundError } from "./movies.errors.ts";
import { Movie } from "./movies.types.ts";
import { getAllMovies as getAllMoviesRepo, getMovieById as getMovieByIdRepo } from "./movies.repo.ts";

export async function getAllMovies(): Promise<Movie[]> {
    return await getAllMoviesRepo();
}

export async function getMovieById(id: number): Promise<Movie> {
    const movie = await getMovieByIdRepo(id);
    if (!movie) throw new MovieNotFoundError(id);
    return movie;
}
