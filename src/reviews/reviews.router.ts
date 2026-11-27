import { Router } from "express"
import { createReviewHandler, deleteReviewHandler, getReviewsHandler } from "./reviews.controller.ts";
import { handleReviewErrors } from "./reviews.errors.ts";

// mergeParams: damit :id aus dem Mount-Pfad /books/:id/reviews hier ankommt
const router = Router({ mergeParams: true });

/**
 * @openapi
 * /books/{id}/reviews:
 *   get:
 *     summary: Alle Rezensionen eines Buchs holen
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
 *         description: Liste der Rezensionen (leer, wenn es noch keine gibt)
 *       400:
 *         description: Die ID ist keine gültige positive Ganzzahl.
 *       401:
 *         description: Der apiKey fehlt oder ist falsch.
 *       404:
 *         description: Kein Buch mit der ID wurde gefunden.
 */
router.get("/", getReviewsHandler);


/**
 * @openapi
 * /books/{id}/reviews:
 *   post:
 *     summary: Eine Rezension zu einem Buch anlegen
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - author
 *               - rating
 *               - comment
 *             properties:
 *               author:
 *                 type: string
 *                 example: "Anna"
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "Sehr lesenswert."
 *     responses:
 *       201:
 *         description: Die angelegte Rezension
 *       400:
 *         description: Die ID oder die Eingabe ist ungültig.
 *       401:
 *         description: Der apiKey fehlt oder ist falsch.
 *       404:
 *         description: Kein Buch mit der ID wurde gefunden.
 */
router.post("/", createReviewHandler);


/**
 * @openapi
 * /books/{id}/reviews/{reviewId}:
 *   delete:
 *     summary: Eine Rezension eines Buchs löschen
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: reviewId
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
 *         description: Die gelöschte Rezension
 *       400:
 *         description: Eine ID ist keine gültige positive Ganzzahl.
 *       401:
 *         description: Der apiKey fehlt oder ist falsch.
 *       404:
 *         description: Das Buch oder die Rezension (zu diesem Buch) wurde nicht gefunden.
 */
router.delete("/:reviewId", deleteReviewHandler);

router.use(handleReviewErrors);

export default router;
