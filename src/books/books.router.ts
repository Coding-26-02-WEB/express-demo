import { Router } from "express"
import { getBookHandler, getBooksHandler } from "./books.controller";

const router = Router();

router.get("/", getBooksHandler);
router.get("/:id", getBookHandler);

export default router;