import { Response, Request, NextFunction } from "express";
import { getAllBooks, getBookById } from "./books.service";

export async function getBooksHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await getAllBooks();
        res.status(200).json({
            success: true,
            data: data,
            count: data.length
        })
    } catch (error) {
        next(error);
    }
}

export async function getBookHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const book = await getBookById(Number(req.params.id));

        res.status(200).json({
            success: true,
            data: book
        })
    } catch (error) {
        next(error);
    }
}