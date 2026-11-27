import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../utils/sendSuccess.ts";
import { createReviewForBook, deleteReviewForBook, getReviewsForBook } from "./reviews.service.ts";

export async function getReviewsHandler(req: Request, res: Response, next: NextFunction) {
    try {
        sendSuccess(res, await getReviewsForBook(Number(req.params.id)));
    } catch (error) {
        next(error);
    }
}

export async function createReviewHandler(req: Request, res: Response, next: NextFunction) {
    try {
        sendSuccess(res, await createReviewForBook(Number(req.params.id), req.body), 201);
    } catch (error) {
        next(error);
    }
}

export async function deleteReviewHandler(req: Request, res: Response, next: NextFunction) {
    try {
        sendSuccess(
            res,
            await deleteReviewForBook(Number(req.params.id), Number(req.params.reviewId))
        );
    } catch (error) {
        next(error);
    }
}
