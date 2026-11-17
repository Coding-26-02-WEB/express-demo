import { Request, Response, NextFunction } from "express";

export function checkApiKey(req: Request, res: Response, next: NextFunction) {
    const { apiKey } = req.query;
    if (apiKey !== "123456") {
        return res.send(401).json({ error: "API Key missing or invalid"});
    }
    next();
}