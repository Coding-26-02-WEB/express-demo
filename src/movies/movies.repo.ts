import getPostgresPool from "../utils/pool.postgres.ts";
import { Movie } from "./movies.types.ts";

const pool = getPostgresPool();

// So kommt eine Zeile aus der DB: Crew flach als Spalten, Genres schon als Array
interface MovieRow {
    id: number;
    title: string;
    year: number;
    director: string;
    editor: string;
    cinematographer: string;
    genres: string[];
}

// Genres per JOIN als (alphabetisch sortiertes) Array, [] wenn kein Genre
const MOVIE_SELECT = `
    SELECT
        m.id, m.title, m.year,
        m.director, m.editor, m.cinematographer,
        COALESCE(
            array_agg(g.name ORDER BY g.name) FILTER (WHERE g.name IS NOT NULL),
            '{}'
        ) AS genres
    FROM movies m
    LEFT JOIN movie_genres mg ON mg.movie_id = m.id
    LEFT JOIN genres g        ON g.id = mg.genre_id
`;

// Baut aus der flachen DB-Zeile die API-Form mit crew als Objekt
function toMovie(row: MovieRow): Movie {
    return {
        id: row.id,
        title: row.title,
        year: row.year,
        crew: {
            director: row.director,
            editor: row.editor,
            cinematographer: row.cinematographer,
        },
        genres: row.genres,
    };
}

export async function getAllMovies(): Promise<Movie[]> {
    const result = await pool.query<MovieRow>(
        `${MOVIE_SELECT} GROUP BY m.id ORDER BY m.id`
    );
    return result.rows.map(toMovie);
}

export async function getMovieById(id: number): Promise<Movie | null> {
    const result = await pool.query<MovieRow>(
        `${MOVIE_SELECT} WHERE m.id = $1 GROUP BY m.id`,
        [id]
    );
    if (result.rows.length === 0) return null;
    return toMovie(result.rows[0]);
}
