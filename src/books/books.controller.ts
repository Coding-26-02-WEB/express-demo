import { Response, Request, NextFunction } from "express";
import { createBook, getAllBooks, getBookById, searchBook } from "./books.service.ts";
import { BookDataInvalidError, BookSearchQueryMissingError } from "./books.errors.ts";
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
        const { query } = req.query;
        if (typeof query !== "string" || !query) throw new BookSearchQueryMissingError();
        sendSuccess(res, await searchBook(query));
    } catch (error) {
        next(error);
    }
}

export async function createBookHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const { title, author } = req.body ?? {};
        if (typeof title !== "string" || !title.trim()) throw new BookDataInvalidError();
        if (typeof author !== "string" || !author.trim()) throw new BookDataInvalidError();
        sendSuccess(res, await createBook({ title: title.trim(), author: author.trim() }), 201);
    } catch (error) {
        next(error);
    }
}