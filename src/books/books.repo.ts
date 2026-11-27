import { DatabaseError } from "pg";
import getPostgresPool from "../utils/pool.postgres";
import { Book, NewBook } from "./books.service";
import { BookAlreadyExistsError } from "./books.errors.ts";

const pool = getPostgresPool();
const BOOK_SELECT = `
    SELECT books.*, AVG(reviews.rating)::float AS average_rating
    FROM books
    LEFT JOIN reviews ON reviews.book_id = books.id
`;

export async function getAllBooks(): Promise<Book[]> {
    const result = await pool.query(`${BOOK_SELECT} GROUP BY books.id`);
    return result.rows;
}

export async function getBookById(id: number): Promise<Book | null> {
    const result = await pool.query(
        `${BOOK_SELECT} WHERE books.id = $1 GROUP BY books.id`,
        [id]
    );
    if (result.rows.length === 0) return null;
    return result.rows[0];
}

export async function searchBook(query: string): Promise<Book[]> {
    const result = await pool.query(
        `${BOOK_SELECT} WHERE books.title ILIKE $1 OR books.author ILIKE $1 GROUP BY books.id`,
        [`%${query}%`]
    );
    return result.rows;
}

export async function createBook(book: NewBook): Promise<Book> {
    try {
        const result = await pool.query(
            `WITH created_book AS (
                INSERT INTO books (title, author, release_date)
                VALUES ($1, $2, $3)
                RETURNING *
            )
            SELECT created_book.*, AVG(reviews.rating)::float AS average_rating
            FROM created_book
            LEFT JOIN reviews ON reviews.book_id = created_book.id
            GROUP BY created_book.id`,
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