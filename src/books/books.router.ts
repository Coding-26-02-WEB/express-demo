import { Router } from "express"
import { getBookHandler, getBooksHandler } from "./books.controller.ts";
import { handleBookErrors } from "./books.errors.ts";

const router = Router();

router.get("/", getBooksHandler);
router.get("/:id", getBookHandler);

router.use(handleBookErrors);

export default router;