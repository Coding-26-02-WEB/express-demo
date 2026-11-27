import { Response, Request, NextFunction } from "express";
import { createReviewForBook, deleteReviewFromBook, getReviewsForBook } from "./reviews.service.ts";
import { ReviewIdInvalidError } from "./reviews.errors.ts";
import { sendSuccess } from "../utils/sendSuccess.ts";

// "abc", "0", "1.5" -> 400 statt Postgres-Fehler (500)
function parseId(name: string, value: string): number {
    const id = Number(value);
    if (!Number.isInteger(id) || id < 1) throw new ReviewIdInvalidError(name, value);
    return id;
}

export async function getReviewsHandler(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        const bookId = parseId("book ID", req.params.id);
        sendSuccess(res, await getReviewsForBook(bookId));
    } catch (error) {
        next(error);
    }
}

export async function createReviewHandler(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        const bookId = parseId("book ID", req.params.id);
        sendSuccess(res, await createReviewForBook(bookId, req.body), 201);
    } catch (error) {
        next(error);
    }
}

export async function deleteReviewHandler(req: Request<{ id: string; reviewId: string }>, res: Response, next: NextFunction) {
    try {
        const bookId = parseId("book ID", req.params.id);
        const reviewId = parseId("review ID", req.params.reviewId);
        sendSuccess(res, await deleteReviewFromBook(bookId, reviewId));
    } catch (error) {
        next(error);
    }
}
