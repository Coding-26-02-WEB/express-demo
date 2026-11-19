import { Router } from "express"
import { getMovieHandler, getMoviesHandler } from "./movies.controller.ts";
import { handleMovieErrors } from "./movies.errors.ts";

const router = Router();

router.get("/", getMoviesHandler);
router.get("/:id", getMovieHandler);

router.use(handleMovieErrors);

export default router;
