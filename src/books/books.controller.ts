import { Response, Request, NextFunction } from "express";
import { getAllBooks, getBookById, searchBooks } from "./books.service.ts";
import { InvalidSearchLimitError, MissingSearchQueryError } from "./books.errors.ts";
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

function parseLimit(value: unknown): number | undefined {
    if (value === undefined) return undefined;
    if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
        throw new InvalidSearchLimitError();
    }
    const limit = Number(value);
    if (!Number.isSafeInteger(limit)) {
        throw new InvalidSearchLimitError();
    }
    return limit;
}

export async function searchBooksHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const query = req.query.query;
        if (typeof query !== "string" || query.trim() === "") {
            throw new MissingSearchQueryError();
        }
        const limit = parseLimit(req.query.limit);
        sendSuccess(res, await searchBooks(query.trim(), limit));
    } catch (error) {
        next(error);
    }
}