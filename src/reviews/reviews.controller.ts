import { NextFunction, Request, Response } from "express";
import { createReviewForBook, deleteReviewForBook, getReviewsForBook } from "./reviews.service.ts";
import { InvalidReviewError } from "./reviews.errors.ts";
import { sendSuccess } from "../utils/sendSuccess.ts";

export async function getReviewsHandler(req: Request, res: Response, next: NextFunction) {
    try {
        sendSuccess(res, await getReviewsForBook(Number(req.params.id)));
    } catch (error) {
        next(error);
    }
}

export async function createReviewHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const body = req.body ?? {};
        const author = typeof body.author === "string" ? body.author.trim() : "";
        const comment = typeof body.comment === "string" ? body.comment.trim() : "";
        const rating = Number(body.rating);

        if (!author) throw new InvalidReviewError("Review requires an author.");
        if (!comment) throw new InvalidReviewError("Review requires a comment.");
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            throw new InvalidReviewError("Review rating must be a whole number between 1 and 5.");
        }

        const review = await createReviewForBook(Number(req.params.id), { author, rating, comment });
        sendSuccess(res, review, 201);
    } catch (error) {
        next(error);
    }
}

export async function deleteReviewHandler(req: Request, res: Response, next: NextFunction) {
    try {
        await deleteReviewForBook(Number(req.params.id), Number(req.params.reviewId));
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}
