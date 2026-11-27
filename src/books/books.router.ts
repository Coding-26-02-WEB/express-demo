import { Router } from "express"
import { getBookHandler, getBooksHandler } from "./books.controller.ts";
import { handleBookErrors } from "./books.errors.ts";

const router = Router();

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Alle Bücher holen als Array
 *     parameters:
 *       - in: query
 *         name: apiKey
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste aller Bücher, jeweils mit averageRating. Ohne Rezensionen ist averageRating null.
 */
router.get("/", getBooksHandler);


/**
 * @openapi
 * /books/{id}:
 *   get:
 *     summary: Ein Buch mit einer bestimmten ID holen
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: apiKey
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ein Buch mit averageRating. Ohne Rezensionen ist averageRating null.
 *       404:
 *         description: Kein Buch mit der ID wurde gefunden.
 */
router.get("/:id", getBookHandler);

router.use(handleBookErrors);

export default router;