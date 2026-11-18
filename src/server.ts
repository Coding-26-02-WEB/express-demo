import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import booksRouter from "./books/books.router";
import moviesRouter from "./movies/movies.router";
import { checkApiKey } from "./middlewares/checkApiKey";
import { error } from "node:console";

const PORT = 3000;
const app = express();

// app.use(logger);
app.use(morgan("dev"));
// app.use(checkApiKey);

app.get("/status", (req, res) => {
    res.status(200).json({ message: "Server is running." })
})

app.use("/books", checkApiKey, booksRouter);
app.use("/movies", moviesRouter);

app.get("/crash", (req, res) => {
    throw Error("Ups, es ist etwas schief gelaufen!!!")
})

app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found.`})
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error."});
})

app.listen(PORT, () => console.log(`Server läuft jetzt auf port ${PORT}`));