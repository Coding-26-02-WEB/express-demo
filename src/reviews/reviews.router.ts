import { Router } from "express";
import {
    createReviewHandler,
    deleteReviewHandler,
    getReviewsHandler,
} from "./reviews.controller.ts";
import { handleReviewErrors } from "./reviews.errors.ts";

const router = Router({ mergeParams: true });

/**
 * @openapi
 * /books/{id}/reviews:
 *   get:
 *     summary: Rezensionen eines Buchs abrufen
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
 *         description: Rezensionen des Buchs
 *       400:
 *         description: Die Buch-ID ist ungültig.
 *       404:
 *         description: Das Buch wurde nicht gefunden.
 */
router.get("/", getReviewsHandler);

/**
 * @openapi
 * /books/{id}/reviews:
 *   post:
 *     summary: Eine Rezension für ein Buch anlegen
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
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Die angelegte Rezension
 *       400:
 *         description: Die Rezension enthält ungültige Daten oder die Buch-ID ist ungültig.
 *       404:
 *         description: Das Buch wurde nicht gefunden.
 */
router.post("/", createReviewHandler);

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
 *         description: Eine ID ist ungültig.
 *       404:
 *         description: Das Buch oder die Rezension wurde nicht gefunden.
 */
router.delete("/:reviewId", deleteReviewHandler);

router.use(handleReviewErrors);

export default router;
