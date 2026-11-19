import { Router } from "express"
import { getMovieHandler, getMoviesHandler } from "./movies.controller.ts";
import { handleMovieErrors } from "./movies.errors.ts";

const router = Router();

/**
 * @openapi
 * /movies:
 *   get:
 *     summary: Alle Filme holen als Array
 *     responses:
 *       200:
 *         description: Liste aller Filme
 */
router.get("/", getMoviesHandler);


/**
 * @openapi
 * /movies/{id}:
 *   get:
 *     summary: Einen Film mit einer bestimmten ID holen
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ein Film
 *       404:
 *         description: Kein Film mit der ID wurde gefunden.
 */
router.get("/:id", getMovieHandler);

router.use(handleMovieErrors);

export default router;
