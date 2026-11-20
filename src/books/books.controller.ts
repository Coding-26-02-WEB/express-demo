import { Response, Request, NextFunction } from "express";
import { getAllBooks, getBookById, searchBooks } from "./books.service.ts";
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

export async function getBooksSearchHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const query = req.query.query?.toString() ?? ""

        sendSuccess(res, await searchBooks(query));
    } catch (error) {
        next(error);
    }
}