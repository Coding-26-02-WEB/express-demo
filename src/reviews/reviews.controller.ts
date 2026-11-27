import { NextFunction, Request, Response } from "express";
import { getBookById } from "../books/books.service.ts";
import { sendSuccess } from "../utils/sendSuccess.ts";
import { InvalidReviewInputError } from "./reviews.errors.ts";
import { createReview, deleteReview, listReviews, type NewReview } from "./reviews.service.ts";

function parsePositiveInt(value: unknown, label: string): number {
    const raw = Array.isArray(value) ? value[0] : value;
    if (typeof raw !== "string" || !/^[1-9]\d*$/.test(raw)) {
        throw new InvalidReviewInputError(`${label} must be a positive integer.`);
    }
    const id = Number(raw);
    if (!Number.isSafeInteger(id)) {
        throw new InvalidReviewInputError(`${label} must be a positive integer.`);
    }
    return id;
}

function parseNewReview(body: unknown): NewReview {
    if (typeof body !== "object" || body === null) {
        throw new InvalidReviewInputError("Review body must be an object with author, rating and comment.");
    }
    const { author, rating, comment } = body as Record<string, unknown>;
    if (typeof author !== "string" || author.trim() === "") {
        throw new InvalidReviewInputError("Author must be a non-empty string.");
    }
    if (typeof comment !== "string" || comment.trim() === "") {
        throw new InvalidReviewInputError("Comment must be a non-empty string.");
    }
    if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new InvalidReviewInputError("Rating must be an integer between 1 and 5.");
    }
    return { author: author.trim(), rating, comment: comment.trim() };
}

export async function getReviewsHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const bookId = parsePositiveInt(req.params.id, "Book id");
        await getBookById(bookId);
        sendSuccess(res, await listReviews(bookId));
    } catch (error) {
        next(error);
    }
}

export async function postReviewHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const bookId = parsePositiveInt(req.params.id, "Book id");
        const input = parseNewReview(req.body);
        await getBookById(bookId);
        sendSuccess(res, await createReview(bookId, input), 201);
    } catch (error) {
        next(error);
    }
}

export async function deleteReviewHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const bookId = parsePositiveInt(req.params.id, "Book id");
        const reviewId = parsePositiveInt(req.params.reviewId, "Review id");
        await getBookById(bookId);
        await deleteReview(bookId, reviewId);
        sendSuccess(res, { deleted: true });
    } catch (error) {
        next(error);
    }
}
