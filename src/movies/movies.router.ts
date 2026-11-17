import { Router } from "express"
import { getMovieHandler, getMoviesHandler } from "./movies.controller";

const router = Router();

router.get("/", getMoviesHandler);
router.get("/:id", getMovieHandler);

export default router;
