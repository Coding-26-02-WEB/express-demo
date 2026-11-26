import getPostgresPool from "../utils/pool.postgres.ts";
import type { Movie } from "./movies.service.ts";

const pool = getPostgresPool();

// So kommt eine Zeile aus der Datenbank zurück (flach + genres als Array)
interface MovieRow {
    id: number;
    title: string;
    year: number;
    director: string;
    editor: string;
    cinematographer: string;
    genres: string[];
}

// Gemeinsamer Teil der Abfrage: Film + alle Genres als Array.
// LEFT JOIN, damit auch Filme ohne Genre gefunden werden.
const SELECT_MOVIES = `
    SELECT
        m.id, m.title, m.year,
        m.director, m.editor, m.cinematographer,
        COALESCE(
            array_agg(g.name ORDER BY g.name) FILTER (WHERE g.id IS NOT NULL),
            '{}'
        ) AS genres
    FROM movies m
    LEFT JOIN movie_genres mg ON mg.movie_id = m.id
    LEFT JOIN genres g ON g.id = mg.genre_id
`;

// flache DB-Zeile -> Movie mit verschachteltem crew-Objekt
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
        `${SELECT_MOVIES} GROUP BY m.id ORDER BY m.id`
    );
    return result.rows.map(toMovie);
}

export async function getMovieById(id: number): Promise<Movie | null> {
    const result = await pool.query<MovieRow>(
        `${SELECT_MOVIES} WHERE m.id = $1 GROUP BY m.id`,
        [id]
    );
    if (result.rows.length === 0) return null;
    return toMovie(result.rows[0]);
}
