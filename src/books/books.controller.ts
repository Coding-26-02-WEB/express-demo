import { Response, Request, NextFunction } from "express";
import { getAllBooks, getBookById, searchBook } from "./books.service.ts";
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

export async function searchBookHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const query = typeof req.query.q === "string" ? req.query.q : "";

        sendSuccess(res, await searchBook(query));
   } catch (error) {
        next(error);
   }
}