import { Response, Request, NextFunction } from "express";
import { getAllBooks, getBookById, searchBooksByTitle } from "./books.service.ts";
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
        const title = typeof req.query.query === "string" ? req.query.query : undefined;
        console.log("Searching for books with title:", title);
        sendSuccess(res, await searchBooksByTitle(title));
    } catch (error) {
        next(error);
    }
}