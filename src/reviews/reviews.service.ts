import { getBookById } from "../books/books.service.ts";
import { ReviewDataInvalidError, ReviewNotFoundError } from "./reviews.errors.ts";
import {
    createReview as createReviewRepo,
    deleteReview as deleteReviewRepo,
    getReviewsByBookId as getReviewsByBookIdRepo,
} from "./reviews.repo.ts";

export interface Review {
    id: number;
    book_id: number;
    author: string;
    rating: number;         // 1–5
    comment: string | null;
    created_at: string;     // ISO-Timestamp
}

export type NewReview = Pick<Review, "author" | "rating" | "comment">;

export async function getReviewsForBook(bookId: number): Promise<Review[]> {
    await getBookById(bookId); // wirft BookNotFoundError -> 404
    return await getReviewsByBookIdRepo(bookId);
}

export async function createReviewForBook(bookId: number, data: unknown): Promise<Review> {
    const review = validateNewReview(data);
    await getBookById(bookId);
    return await createReviewRepo(bookId, review);
}

export async function deleteReviewFromBook(bookId: number, reviewId: number): Promise<Review> {
    const review = await deleteReviewRepo(bookId, reviewId);
    if (!review) throw new ReviewNotFoundError(bookId, reviewId);
    return review;
}

// Prüft die Daten aus dem Request-Body, bevor sie in der DB landen
function validateNewReview(data: unknown): NewReview {
    if (typeof data !== "object" || data === null) throw new ReviewDataInvalidError("The request body must be a JSON object.");
    const { author, rating, comment } = data as Record<string, unknown>;

    if (typeof author !== "string" || !author.trim()) throw new ReviewDataInvalidError("The author is required.");

    // kein String wie "5" und keine Kommazahl wie 4.5
    if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new ReviewDataInvalidError("The rating must be an integer between 1 and 5.");
    }

    let cleanComment: string | null = null;
    if (comment !== undefined && comment !== null) {
        if (typeof comment !== "string") throw new ReviewDataInvalidError("The comment must be a string.");
        cleanComment = comment.trim() || null;
    }

    return { author: author.trim(), rating, comment: cleanComment };
}
