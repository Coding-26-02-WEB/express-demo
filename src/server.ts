import express from "express";
import booksRouter from "./books/books.router";

const PORT = 3000;
const app = express();

app.get("/ping", (req, res) => {
    res.status(200).json({ message: "pong" })
})

app.use("/books", booksRouter);

app.listen(PORT, () => console.log(`Server läuft jetzt auf port ${PORT}`));