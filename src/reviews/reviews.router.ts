import { Router } from "express";
import { createReviewHandler, deleteReviewHandler, getReviewsHandler } from "./reviews.controller.ts";
import { handleReviewErrors } from "./reviews.errors.ts";

const router = Router();

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
 *     responses:
 *       200:
 *         description: Liste aller Rezensionen des Buchs
 *       404:
 *         description: Kein Buch mit der ID gefunden.
 *   post:
 *     summary: Neue Rezension für ein Buch anlegen
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [author, rating, comment]
 *             properties:
 *               author:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rezension wurde angelegt
 *       400:
 *         description: Ungültige Eingabe (author, rating oder comment)
 *       404:
 *         description: Kein Buch mit der ID gefunden.
 */
router.get("/:id/reviews", getReviewsHandler);
router.post("/:id/reviews", createReviewHandler);

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
 *     responses:
 *       204:
 *         description: Rezension wurde gelöscht
 *       404:
 *         description: Rezension oder Buch nicht gefunden.
 */
router.delete("/:id/reviews/:reviewId", deleteReviewHandler);

router.use(handleReviewErrors);

export default router;
