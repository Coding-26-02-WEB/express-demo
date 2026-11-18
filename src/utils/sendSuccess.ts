import { Response } from "express";

export function sendSuccess<T>(res: Response, data: T, code = 200) {
    res.status(code).json({
            success: true,
            data: data
        })
}