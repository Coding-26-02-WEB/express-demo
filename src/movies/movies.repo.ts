import getPostgresPool from "../utils/pool.postgres.ts";
import { Movie } from "./movies.types.ts";

const pool = getPostgresPool();

// Baut aus der flachen movies-Zeile + JOIN auf die Genres direkt die API-Form:
// crew als Objekt, genres als (alphabetisch sortiertes) Array, [] wenn kein Genre
const MOVIE_SELECT = `
    SELECT
        m.id, m.title, m.year,
        json_build_object(
            'director', m.director,
            'editor', m.editor,
            'cinematographer', m.cinematographer
        ) AS crew,
        COALESCE(
            array_agg(g.name ORDER BY g.name) FILTER (WHERE g.name IS NOT NULL),
            '{}'
        ) AS genres
    FROM movies m
    LEFT JOIN movie_genres mg ON mg.movie_id = m.id
    LEFT JOIN genres g        ON g.id = mg.genre_id
`;

export async function getAllMovies(): Promise<Movie[]> {
    const result = await pool.query(
        `${MOVIE_SELECT} GROUP BY m.id ORDER BY m.id`
    );
    return result.rows;
}

export async function getMovieById(id: number): Promise<Movie | null> {
    const result = await pool.query(
        `${MOVIE_SELECT} WHERE m.id = $1 GROUP BY m.id`,
        [id]
    );
    if (result.rows.length === 0) return null;
    return result.rows[0];
}
