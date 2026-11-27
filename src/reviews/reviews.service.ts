import { getBookById } from "../books/books.repo.ts";
import {
    createReview as createReviewRepo,
    deleteReview as deleteReviewRepo,
    getReviewsForBook as getReviewsForBookRepo,
} from "./reviews.repo.ts";
import { ReviewBookNotFoundError, ReviewDataInvalidError, ReviewNotFoundError } from "./reviews.errors.ts";

export interface Review {
    id: number;
    book_id: number;
    author: string;
    rating: number;
    comment: string;
}

export type NewReview = Omit<Review, "id" | "book_id">;

export async function getReviewsForBook(bookId: number): Promise<Review[]> {
    validateId(bookId, "book");
    await assertBookExists(bookId);
    return getReviewsForBookRepo(bookId);
}

export async function createReviewForBook(bookId: number, data: unknown): Promise<Review> {
    validateId(bookId, "book");
    const review = validateNewReview(data);
    await assertBookExists(bookId);
    return createReviewRepo(bookId, review);
}

export async function deleteReviewForBook(bookId: number, reviewId: number): Promise<Review> {
    validateId(bookId, "book");
    validateId(reviewId, "review");
    await assertBookExists(bookId);
    const review = await deleteReviewRepo(bookId, reviewId);
    if (!review) throw new ReviewNotFoundError(reviewId);
    return review;
}

async function assertBookExists(bookId: number): Promise<void> {
    if (!await getBookById(bookId)) throw new ReviewBookNotFoundError(bookId);
}

function validateId(id: number, resource: string): void {
    if (!Number.isSafeInteger(id) || id < 1) {
        throw new ReviewDataInvalidError(`The ${resource} ID must be a positive integer.`);
    }
}

function validateNewReview(data: unknown): NewReview {
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
        throw new ReviewDataInvalidError("The request body must be a JSON object.");
    }

    const { author, rating, comment } = data as Record<string, unknown>;
    if (typeof author !== "string" || !author.trim()) {
        throw new ReviewDataInvalidError("The author is required.");
    }
    if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new ReviewDataInvalidError("The rating must be an integer between 1 and 5.");
    }
    if (typeof comment !== "string" || !comment.trim()) {
        throw new ReviewDataInvalidError("The comment is required.");
    }

    return { author: author.trim(), rating, comment: comment.trim() };
}
