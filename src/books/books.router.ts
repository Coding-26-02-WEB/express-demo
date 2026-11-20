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
 *         description: Suchbegriff
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Maximale Anzahl der Treffer
 *       - in: query
 *         name: apiKey
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Aufgeräumte Trefferliste (Titel, Autor, ID, Erscheinungsjahr). Ohne Treffer ist data ein leeres Array.
 *       400:
 *         description: Suchbegriff fehlt oder limit ist keine positive Ganzzahl.
 *       401:
 *         description: API-Key fehlt oder ist ungültig.
 *       502:
 *         description: Die Open-Library-Suche ist fehlgeschlagen.
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