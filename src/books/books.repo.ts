import { DatabaseError } from "pg";
import getPostgresPool from "../utils/pool.postgres";
import { Book, NewBook } from "./books.service";
import { BookAlreadyExistsError } from "./books.errors.ts";

const pool = getPostgresPool();

export async function getAllBooks(): Promise<Book[]> {
    const result = await pool.query("SELECT * FROM books");
    return result.rows;
}

export async function getBookById(id: number): Promise<Book | null> {
    const result = await pool.query(
        `SELECT * FROM books WHERE id = $1`,
        [id]
    )
    if (result.rows.length === 0) return null;
    return result.rows[0];
}

export async function searchBook(query: string): Promise<Book[]> {
    const result = await pool.query(
        `SELECT * FROM books WHERE title ILIKE $1 OR author ILIKE $1`,
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
        return result.rows[0];
    } catch (error) {
        // 23505 = unique_violation: Titel + Autor gibt es schon (Index books_title_author_unique)
        if (error instanceof DatabaseError && error.code === "23505" && error.constraint === "books_title_author_unique") {
            throw new BookAlreadyExistsError(book.title, book.author);
        }
        throw error;
    }
}