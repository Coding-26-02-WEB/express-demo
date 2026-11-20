import { Response, Request, NextFunction } from "express";
import { getAllBooks, getBookById, searchBooks } from "./books.service.ts";
import { MissingQueryError } from "./books.errors.ts";
import { sendSuccess } from "../utils/sendSuccess.ts";

export async function getBooksHandler(req: Request, res: Response, next: NextFunction) {
    try {
        sendSuccess(res, await getAllBooks());
    } catch (error) {
        next(error);
    }
}

export async function getBookHandler(req: Request, res: Response, next: NextFunction) {
    try {
        sendSuccess(res, await getBookById(Number(req.params.id)));
    } catch (error) {
        next(error);
    }
}

export async function searchBooksHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const rawQuery = req.query.query;
        const query = typeof rawQuery === "string" ? rawQuery.trim() : "";
        if (!query) throw new MissingQueryError();

        let limit: number | undefined;
        const rawLimit = req.query.limit;
        if (typeof rawLimit === "string" && rawLimit !== "") {
            const parsed = Number(rawLimit);
            if (Number.isInteger(parsed) && parsed > 0) limit = parsed;
        }

        sendSuccess(res, await searchBooks(query, limit));
    } catch (error) {
        next(error);
    }
}