import getPostgresPool from "../utils/pool.postgres";
import { Book } from "./books.service";

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