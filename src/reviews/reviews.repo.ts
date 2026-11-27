import { DatabaseError } from "pg";
import getPostgresPool from "../utils/pool.postgres.ts";
import type { NewReview, Review } from "./reviews.service.ts";
import { ReviewBookNotFoundError } from "./reviews.errors.ts";

const pool = getPostgresPool();

export async function getReviewsForBook(bookId: number): Promise<Review[]> {
    const result = await pool.query(
        `SELECT * FROM reviews WHERE book_id = $1 ORDER BY id`,
        [bookId]
    );
    return result.rows;
}

export async function createReview(bookId: number, review: NewReview): Promise<Review> {
    try {
        const result = await pool.query(
            `INSERT INTO reviews (book_id, author, rating, comment)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [bookId, review.author, review.rating, review.comment]
        );
        return result.rows[0];
    } catch (error) {
        if (error instanceof DatabaseError && error.code === "23503" && error.constraint === "reviews_book_id_fkey") {
            throw new ReviewBookNotFoundError(bookId);
        }
        throw error;
    }
}

export async function deleteReview(bookId: number, reviewId: number): Promise<Review | null> {
    const result = await pool.query(
        `DELETE FROM reviews WHERE book_id = $1 AND id = $2 RETURNING *`,
        [bookId, reviewId]
    );
    return result.rows[0] ?? null;
}
