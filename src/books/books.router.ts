import { Router } from "express"
import { getBookHandler, getBooksHandler, searchBooksHandler } from "./books.controller.ts";
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
 *         description: Liste aller Bücher
 */
router.get("/", getBooksHandler);


/**
 * @openapi
 * /books/search:
 *   get:
 *     summary: Bücher über die Open-Library-API suchen
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: apiKey
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Aufgeräumte Liste gefundener Bücher
 *       400:
 *         description: Kein Suchbegriff angegeben
 *       502:
 *         description: Open-Library nicht erreichbar oder Fehler
 */
router.get("/search", searchBooksHandler);


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
 *         description: Ein Buch
 *       404:
 *         description: Kein Buch mit der ID wurde gefunden.
 */
router.get("/:id", getBookHandler);

router.use(handleBookErrors);

export default router;