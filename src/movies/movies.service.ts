import { MovieNotFoundError } from "./movies.errors.ts";
import { getAllMovies as getAllMoviesRepo, getMovieById as getMovieByIdRepo } from "./movies.repo.ts";

export interface Crew {
    director: string;
    editor: string;
    cinematographer: string;
}

export interface Movie {
    id: number;
    title: string;
    crew: Crew;
    year: number;
    genres: string[];
}

export async function getAllMovies(): Promise<Movie[]> {
    return await getAllMoviesRepo();
}

export async function getMovieById(id: number): Promise<Movie> {
    const movie = await getMovieByIdRepo(id);
    if (!movie) throw new MovieNotFoundError(id);
    return movie;
}
