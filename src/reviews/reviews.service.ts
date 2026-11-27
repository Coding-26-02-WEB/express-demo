import { getBookById } from "../books/books.service.ts";
import { ReviewDataInvalidError, ReviewNotFoundError } from "./reviews.errors.ts";
import { createReview as createReviewRepo, deleteReview as deleteReviewRepo, getReviewsByBookId as getReviewsByBookIdRepo } from "./reviews.repo.ts";

export interface Review {
    id: number;
    book_id: number;
    author: string;
    rating: number; // 1 bis 5
    comment: string;
}

export type NewReview = Omit<Review, "id" | "book_id">;

export async function getReviewsByBookId(bookId: number): Promise<Review[]> {
    await getBookById(bookId); // wirft BookNotFoundError -> sonst käme für unbekannte Bücher eine leere Liste
    return await getReviewsByBookIdRepo(bookId);
}

export async function createReview(bookId: number, data: unknown): Promise<Review> {
    const review = validateNewReview(data);
    await getBookById(bookId);
    return await createReviewRepo(bookId, review);
}

export async function deleteReview(bookId: number, reviewId: number): Promise<Review> {
    await getBookById(bookId);
    const review = await deleteReviewRepo(bookId, reviewId);
    if (!review) throw new ReviewNotFoundError(reviewId, bookId);
    return review;
}

// Prüft die Daten aus dem Request-Body, bevor sie in der DB landen
function validateNewReview(data: unknown): NewReview {
    if (typeof data !== "object" || data === null) throw new ReviewDataInvalidError("The request body must be a JSON object.");
    const { author, rating, comment } = data as Record<string, unknown>;

    if (!isValidText(author)) throw new ReviewDataInvalidError("The author is required.");
    if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new ReviewDataInvalidError("The rating must be an integer from 1 to 5.");
    }
    if (!isValidText(comment)) throw new ReviewDataInvalidError("The comment is required.");

    return { author: author.trim(), rating, comment: comment.trim() };
}

// Nicht leer und ohne Nullzeichen: das kann Postgres nicht speichern und würde sonst zu einem 500 führen
function isValidText(value: unknown): value is string {
    return typeof value === "string" && value.trim() !== "" && !value.includes("\0");
}
