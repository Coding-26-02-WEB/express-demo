import { DatabaseError } from "pg";
import getPostgresPool from "../utils/pool.postgres.ts";
import type { NewReview, Review } from "./reviews.service.ts";
import { BookNotFoundError } from "../books/books.errors.ts";

const pool = getPostgresPool();

export async function getReviewsByBookId(bookId: number): Promise<Review[]> {
    const result = await pool.query<Review>(
        `SELECT * FROM reviews WHERE book_id = $1 ORDER BY created_at DESC, id DESC`,
        [bookId]
    );
    return result.rows;
}

export async function createReview(bookId: number, review: NewReview): Promise<Review> {
    try {
        const result = await pool.query<Review>(
            `INSERT INTO reviews (book_id, author, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *`,
            [bookId, review.author, review.rating, review.comment]
        );
        return result.rows[0];
    } catch (error) {
        // 23503 = foreign_key_violation: das Buch wurde zwischen Check im Service und Insert gelöscht
        if (error instanceof DatabaseError && error.code === "23503") {
            throw new BookNotFoundError(bookId);
        }
        throw error;
    }
}

// book_id mit in der Bedingung, sonst ließe sich über /books/1/reviews/7 eine Review von Buch 2 löschen
export async function deleteReview(bookId: number, reviewId: number): Promise<Review | null> {
    const result = await pool.query<Review>(
        `DELETE FROM reviews WHERE id = $1 AND book_id = $2 RETURNING *`,
        [reviewId, bookId]
    );
    if (result.rows.length === 0) return null;
    return result.rows[0];
}
