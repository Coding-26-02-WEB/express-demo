import { Response, Request, NextFunction } from "express";
import { getAllBooks, getBookById, searchBooks } from "./books.service.ts";
import { BookSearchQueryMissingError } from "./books.errors.ts";
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
        const query = req.query.query;
        if (typeof query !== "string" || query.trim().length === 0) {
            throw new BookSearchQueryMissingError();
        }
        sendSuccess(res, await searchBooks(query.trim()));
    } catch (error) {
        next(error);
    }
}