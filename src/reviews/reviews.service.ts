import { BookNotFoundError } from "../books/books.errors.ts";
import { getPool } from "../db/pool.ts";
import { InvalidReviewInputError, ReviewNotFoundError } from "./reviews.errors.ts";

function databaseCode(error: unknown): string | undefined {
    if (typeof error === "object" && error !== null && "code" in error && typeof error.code === "string") {
        return error.code;
    }
    return undefined;
}

export interface Review {
    id: number;
    bookId: number;
    author: string;
    rating: number;
    comment: string;
}

export interface NewReview {
    author: string;
    rating: number;
    comment: string;
}

interface ReviewRow {
    id: number;
    book_id: number;
    author: string;
    rating: number;
    comment: string;
}

function toReview(row: ReviewRow): Review {
    return {
        id: row.id,
        bookId: row.book_id,
        author: row.author,
        rating: row.rating,
        comment: row.comment,
    };
}

export async function getAverageRatingByBook(): Promise<Map<number, number>> {
    if (!process.env.DATABASE_URL) return new Map();
    const result = await getPool().query<{ book_id: number; average_rating: number }>(
        `SELECT book_id, AVG(rating)::float8 AS average_rating
         FROM reviews
         GROUP BY book_id`,
    );
    return new Map(result.rows.map((row) => [row.book_id, row.average_rating]));
}

export async function listReviews(bookId: number): Promise<Review[]> {
    const result = await getPool().query<ReviewRow>(
        `SELECT id, book_id, author, rating, comment
         FROM reviews
         WHERE book_id = $1
         ORDER BY id`,
        [bookId],
    );
    return result.rows.map(toReview);
}

export async function createReview(bookId: number, input: NewReview): Promise<Review> {
    try {
        const result = await getPool().query<ReviewRow>(
            `INSERT INTO reviews (book_id, author, rating, comment)
             VALUES ($1, $2, $3, $4)
             RETURNING id, book_id, author, rating, comment`,
            [bookId, input.author, input.rating, input.comment],
        );
        const row = result.rows[0];
        if (!row) {
            throw new Error("Review was not created.");
        }
        return toReview(row);
    } catch (error) {
        if (databaseCode(error) === "23503") throw new BookNotFoundError(bookId);
        if (databaseCode(error) === "23514") {
            throw new InvalidReviewInputError("Rating must be an integer between 1 and 5.");
        }
        throw error;
    }
}

export async function deleteReview(bookId: number, reviewId: number): Promise<void> {
    const result = await getPool().query(
        `DELETE FROM reviews
         WHERE id = $1 AND book_id = $2`,
        [reviewId, bookId],
    );
    if ((result.rowCount ?? 0) === 0) {
        throw new ReviewNotFoundError(reviewId);
    }
}
