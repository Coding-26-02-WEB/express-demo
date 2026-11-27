import { Router } from "express";
import { deleteReviewHandler, getReviewsHandler, postReviewHandler } from "./reviews.controller.ts";
import { handleReviewErrors } from "./reviews.errors.ts";

const router = Router({ mergeParams: true });

/**
 * @openapi
 * /books/{id}/reviews:
 *   get:
 *     summary: Rezensionen eines Buchs holen
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: apiKey
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste der Rezensionen. Ohne Rezensionen ist data ein leeres Array.
 *       400:
 *         description: Die Buch-ID ist keine positive Ganzzahl.
 *       401:
 *         description: API-Key fehlt oder ist ungültig.
 *       404:
 *         description: Kein Buch mit der ID wurde gefunden.
 *   post:
 *     summary: Eine Rezension anlegen
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
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
 *         description: Die angelegte Rezension.
 *       400:
 *         description: Buch-ID oder Body ist ungültig.
 *       401:
 *         description: API-Key fehlt oder ist ungültig.
 *       404:
 *         description: Kein Buch mit der ID wurde gefunden.
 */
router.get("/", getReviewsHandler);
router.post("/", postReviewHandler);

/**
 * @openapi
 * /books/{id}/reviews/{reviewId}:
 *   delete:
 *     summary: Eine Rezension löschen
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: apiKey
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Die Rezension wurde gelöscht.
 *       400:
 *         description: Buch-ID oder Rezensions-ID ist keine positive Ganzzahl.
 *       401:
 *         description: API-Key fehlt oder ist ungültig.
 *       404:
 *         description: Buch oder Rezension wurde nicht gefunden.
 */
router.delete("/:reviewId", deleteReviewHandler);

router.use(handleReviewErrors);

export default router;
