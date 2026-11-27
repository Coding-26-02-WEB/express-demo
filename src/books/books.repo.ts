import { DatabaseError } from "pg";
import getPostgresPool from "../utils/pool.postgres";
import { Book, NewBook } from "./books.service";
import { BookAlreadyExistsError } from "./books.errors.ts";

const pool = getPostgresPool();

// LEFT JOIN: Bücher ohne Rezensionen bleiben dabei (average_rating = null).
// ::float8, weil pg das Ergebnis von AVG (numeric) sonst als String liefert.
const SELECT_BOOKS = `
    SELECT b.*, AVG(r.rating)::float8 AS average_rating
    FROM books b
    LEFT JOIN reviews r ON r.book_id = b.id`;

export async function getAllBooks(): Promise<Book[]> {
    const result = await pool.query(`${SELECT_BOOKS} GROUP BY b.id ORDER BY b.id`);
    return result.rows;
}

export async function getBookById(id: number): Promise<Book | null> {
    const result = await pool.query(
        `${SELECT_BOOKS} WHERE b.id = $1 GROUP BY b.id`,
        [id]
    )
    if (result.rows.length === 0) return null;
    return result.rows[0];
}

export async function searchBook(query: string): Promise<Book[]> {
    const result = await pool.query(
        `${SELECT_BOOKS} WHERE b.title ILIKE $1 OR b.author ILIKE $1 GROUP BY b.id ORDER BY b.id`,
        [`%${query}%`]
    );
    return result.rows;
}

export async function createBook(book: NewBook): Promise<Book> {
    try {
        const result = await pool.query(
            // Ein neues Buch hat noch keine Rezensionen
            `INSERT INTO books (title, author, release_date) VALUES ($1, $2, $3) RETURNING *, NULL::float8 AS average_rating`,
            [book.title, book.author, book.release_date]
        );
        return result.rows[0];
    } catch (error) {
        // 23505 = unique_violation: Titel + Autor gibt es schon (Index books_title_author_unique)
        if (error instanceof DatabaseError && error.code === "23505" && error.constraint === "books_title_author_unique") {
            throw new BookAlreadyExistsError(book.title, book.author);
        }
        throw error;
    }
}