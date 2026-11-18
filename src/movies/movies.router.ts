import { Router } from "express"
import { getMovieHandler, getMoviesHandler } from "./movies.controller";
import { handleMovieErrors } from "./movies.errors";

const router = Router();

router.get("/", getMoviesHandler);
router.get("/:id", getMovieHandler);

router.use(handleMovieErrors);

export default router;
