import express from "express";
import morgan from "morgan";
import booksRouter from "./books/books.router";
import moviesRouter from "./movies/movies.router";
import { logger } from "./middlewares/logger";
import { checkApiKey } from "./middlewares/checkApiKey";

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

app.listen(PORT, () => console.log(`Server läuft jetzt auf port ${PORT}`));