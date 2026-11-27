import { BookNotFoundError } from "../books/books.errors.ts";
import { ReviewNotFoundError } from "./reviews.errors.ts";
import * as reviewsRepo from "./reviews.repo.ts";
import type { Review } from "./reviews.repo.ts";

export interface ReviewInput {
    author: string;
    rating: number;
    comment: string;
}

export async function getReviewsForBook(bookId: number): Promise<Review[]> {
    if (!(await reviewsRepo.bookExists(bookId))) {
        throw new BookNotFoundError(bookId);
    }
    return reviewsRepo.getReviewsByBookId(bookId);
}

export async function createReviewForBook(bookId: number, data: ReviewInput): Promise<Review> {
    if (!(await reviewsRepo.bookExists(bookId))) {
        throw new BookNotFoundError(bookId);
    }
    return reviewsRepo.createReview(bookId, data.author, data.rating, data.comment);
}

export async function deleteReviewForBook(bookId: number, reviewId: number): Promise<void> {
    if (!(await reviewsRepo.bookExists(bookId))) {
        throw new BookNotFoundError(bookId);
    }
    const deleted = await reviewsRepo.deleteReview(bookId, reviewId);
    if (!deleted) {
        throw new ReviewNotFoundError(reviewId);
    }
}
