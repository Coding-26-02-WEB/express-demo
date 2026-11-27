import { DatabaseError } from "pg";
import getPostgresPool from "../utils/pool.postgres";
import { Book, NewBook } from "./books.service";
import { BookAlreadyExistsError } from "./books.errors.ts";

const pool = getPostgresPool();

// LEFT JOIN, damit Bücher ohne Review nicht wegfallen (AVG über keine Zeilen = NULL).
// ::float, weil AVG ein numeric liefert und pg numeric als String zurückgibt ("4.5").
const SELECT_BOOKS = `
    SELECT b.*, ROUND(AVG(r.rating), 1)::float AS average_rating
    FROM books b
    LEFT JOIN reviews r ON r.book_id = b.id
`;

export async function getAllBooks(): Promise<Book[]> {
    const result = await pool.query<Book>(`${SELECT_BOOKS} GROUP BY b.id ORDER BY b.id`);
    return result.rows;
}

export async function getBookById(id: number): Promise<Book | null> {
    const result = await pool.query<Book>(
        `${SELECT_BOOKS} WHERE b.id = $1 GROUP BY b.id`,
        [id]
    )
    if (result.rows.length === 0) return null;
    return result.rows[0];
}

export async function searchBook(query: string): Promise<Book[]> {
    const result = await pool.query<Book>(
        `${SELECT_BOOKS} WHERE b.title ILIKE $1 OR b.author ILIKE $1 GROUP BY b.id ORDER BY b.id`,
        [`%${query}%`]
    );
    return result.rows;
}

export async function createBook(book: NewBook): Promise<Book> {
    try {
        const result = await pool.query(
            `INSERT INTO books (title, author, release_date) VALUES ($1, $2, $3) RETURNING *`,
            [book.title, book.author, book.release_date]
        );
        // ein neues Buch hat noch keine Reviews
        return { ...result.rows[0], average_rating: null };
    } catch (error) {
        // 23505 = unique_violation: Titel + Autor gibt es schon (Index books_title_author_unique)
        if (error instanceof DatabaseError && error.code === "23505" && error.constraint === "books_title_author_unique") {
            throw new BookAlreadyExistsError(book.title, book.author);
        }
        throw error;
    }
}
