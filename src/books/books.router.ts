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

// Dieser OpenAPI-Block dokumentiert die Suchroute in Swagger unter /docs.
/**
 * @openapi
 * /books/search:
 *   get:
 *     summary: Bücher über Open Library suchen
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: apiKey
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Aufgeräumte Liste der Suchtreffer
 *       400:
 *         description: Kein Suchbegriff angegeben
 *       502:
 *         description: Suche bei Open Library fehlgeschlagen
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