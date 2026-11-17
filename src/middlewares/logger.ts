import { Request, Response, NextFunction } from "express";

export function logger(req: Request, _: Response, next: NextFunction) {
    console.log(`${req.method} ${req.originalUrl} ${new Date()}`);
    next();
}