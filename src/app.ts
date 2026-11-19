import express, { NextFunction, Request, Response } from "express";
import booksRouter from "./books/books.router.ts";
import moviesRouter from "./movies/movies.router.ts";
import { checkApiKey } from "./middlewares/checkApiKey.ts";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"

const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: "3.0.0",
        info: { title: "Bücher-und-Filme-Api", version: "1.0.0" }
    },
    apis: [`${import.meta.dirname}/**/*.router.ts`]
})

const app = express();

const CDN = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14";
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCssUrl: `${CDN}/swagger-ui.min.css`,
    customJs: [
        `${CDN}/swagger-ui-bundle.min.js`,
        `${CDN}/swagger-ui-standalone-preset.min.js`,
    ],
}));

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

export default app;