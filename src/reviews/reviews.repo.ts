import { DatabaseError } from "pg";
import getPostgresPool from "../utils/pool.postgres.ts";
import { BookNotFoundError } from "../books/books.errors.ts";
import type { NewReview, Review } from "./reviews.service.ts";

const pool = getPostgresPool();

export async function getReviewsByBookId(bookId: number): Promise<Review[]> {
    const result = await pool.query(
        `SELECT * FROM reviews WHERE book_id = $1 ORDER BY id`,
        [bookId]
    );
    return result.rows;
}

export async function createReview(bookId: number, review: NewReview): Promise<Review> {
    try {
        const result = await pool.query(
            `INSERT INTO reviews (book_id, author, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *`,
            [bookId, review.author, review.rating, review.comment]
        );
        return result.rows[0];
    } catch (error) {
        // 23503 = foreign_key_violation: das Buch wurde zwischen Prüfung und Insert gelöscht
        if (error instanceof DatabaseError && error.code === "23503" && error.constraint === "reviews_book_id_fkey") {
            throw new BookNotFoundError(bookId);
        }
        throw error;
    }
}

// book_id in der Bedingung: eine Rezension lässt sich nur über ihr eigenes Buch löschen
export async function deleteReview(bookId: number, reviewId: number): Promise<Review | null> {
    const result = await pool.query(
        `DELETE FROM reviews WHERE id = $1 AND book_id = $2 RETURNING *`,
        [reviewId, bookId]
    );
    if (result.rows.length === 0) return null;
    return result.rows[0];
}
