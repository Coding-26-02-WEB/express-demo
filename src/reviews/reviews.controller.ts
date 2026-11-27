import { Response, Request, NextFunction } from "express";
import { createReview, deleteReview, getReviewsByBookId } from "./reviews.service.ts";
import { sendSuccess } from "../utils/sendSuccess.ts";
import { ReviewIdInvalidError } from "./reviews.errors.ts";

// Größter Wert einer integer-Spalte in Postgres; alles darüber würde die DB mit einem Fehler (-> 500) ablehnen
const MAX_ID = 2147483647;

function parseId(value: string): number {
    const id = Number(value);
    if (!Number.isInteger(id) || id < 1 || id > MAX_ID) throw new ReviewIdInvalidError(value);
    return id;
}

export async function getReviewsHandler(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        sendSuccess(res, await getReviewsByBookId(parseId(req.params.id)));
    } catch (error) {
        next(error);
    }
}

export async function createReviewHandler(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        sendSuccess(res, await createReview(parseId(req.params.id), req.body), 201);
    } catch (error) {
        next(error);
    }
}

export async function deleteReviewHandler(req: Request<{ id: string, reviewId: string }>, res: Response, next: NextFunction) {
    try {
        sendSuccess(res, await deleteReview(parseId(req.params.id), parseId(req.params.reviewId)));
    } catch (error) {
        next(error);
    }
}
