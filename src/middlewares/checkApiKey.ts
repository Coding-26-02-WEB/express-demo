import { Request, Response, NextFunction } from "express";

export function checkApiKey(req: Request, res: Response, next: NextFunction) {
    const { apiKey } = req.query;
    if (!apiKey)                return res.status(401).json({ error: "API Key missing!"});
    if (apiKey !== "123456")    return res.status(401).json({ error: "API Key invalid!"});
    next();
}