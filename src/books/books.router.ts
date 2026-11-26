import { Router } from "express"
import { createBookHandler, getBookHandler, getBooksHandler, searchBooksHandler } from "./books.controller.ts";
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
 * /books:
 *   post:
 *     summary: Ein neues Buch anlegen
 *     parameters:
 *       - in: query
 *         name: apiKey
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               release_date:
 *                 type: string
 *                 format: date
 *                 example: "1937-09-21"
 *     responses:
 *       201:
 *         description: Das angelegte Buch
 *       400:
 *         description: Titel oder Autor fehlt, oder release_date ist kein gültiges Datum (YYYY-MM-DD).
 */
router.post("/", createBookHandler);


/**
 * @openapi
 * /books/search:
 *   get:
 *     summary: Bücher über die OpenLibrary-API suchen
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
 *         description: Liste der gefundenen Bücher
 *       400:
 *         description: Der Suchbegriff fehlt.
 *       502:
 *         description: Die OpenLibrary-API ist nicht erreichbar oder hat einen Fehler zurückgegeben.
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