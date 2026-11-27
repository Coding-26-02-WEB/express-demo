import { Router } from "express"
import { createReviewHandler, deleteReviewHandler, getReviewsHandler } from "./reviews.controller.ts";
import { handleReviewErrors } from "./reviews.errors.ts";

// mergeParams: sonst kommt :id aus "/books/:id/reviews" (app.ts) hier nicht an
const router = Router({ mergeParams: true });

/**
 * @openapi
 * /books/{id}/reviews:
 *   get:
 *     summary: Alle Rezensionen eines Buchs holen (neueste zuerst)
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
 *         description: Liste der Rezensionen (leer, wenn das Buch noch keine hat)
 *       400:
 *         description: Die Buch-ID ist keine gültige positive Ganzzahl.
 *       404:
 *         description: Kein Buch mit der ID wurde gefunden.
 */
router.get("/", getReviewsHandler);


/**
 * @openapi
 * /books/{id}/reviews:
 *   post:
 *     summary: Eine neue Rezension zu einem Buch anlegen
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
 *                 nullable: true
 *                 example: "Sehr spannend."
 *     responses:
 *       201:
 *         description: Die angelegte Rezension
 *       400:
 *         description: Die Buch-ID ist ungültig, der Autor fehlt, das Rating ist keine Ganzzahl von 1 bis 5 oder der Kommentar ist kein String.
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
 *         description: Die Buch-ID oder Review-ID ist keine gültige positive Ganzzahl.
 *       404:
 *         description: Es gibt keine Rezension mit dieser ID zu diesem Buch.
 */
router.delete("/:reviewId", deleteReviewHandler);

router.use(handleReviewErrors);

export default router;
