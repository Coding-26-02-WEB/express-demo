import express, { NextFunction, Request, Response } from "express";
import booksRouter from "./books/books.router.ts";
import moviesRouter from "./movies/movies.router.ts";
import reviewsRouter from "./reviews/reviews.router.ts";
import { checkApiKey } from "./middlewares/checkApiKey.ts";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"
import getPostgresPool from "./utils/pool.postgres.ts";

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
app.use(express.json());
// app.use(checkApiKey);

app.get("/status", (req, res) => {
    res.status(200).json({ message: "Server is running." })
})

app.use("/books/:id/reviews", checkApiKey, reviewsRouter);
app.use("/books", checkApiKey, booksRouter);
app.use("/movies", moviesRouter);

app.get("/crash", (req, res) => {
    throw Error("Ups, es ist etwas schief gelaufen!!!")
})

app.get("/date", async (req, res) => {
    const pool = getPostgresPool();
    const dbResponse = await pool.query("SELECT NOW()");
    res.status(200).json(dbResponse.rows[0]);
})

app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found.`})
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // express.json() wirft einen SyntaxError, wenn der Request-Body kein gültiges JSON ist
    if (err instanceof SyntaxError && "body" in err) {
        return res.status(400).json({ error: "Invalid JSON in request body." });
    }
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error."});
})

export default app;