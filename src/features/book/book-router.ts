import path from "node:path";
import { Router } from "express";
import {
  createBook,
  getSingleBook,
  listBooks,
  updateBook,
} from "./book-controller";
import multer from "multer";
import authenticate from "../../middlewares/authenticate";

const bookRouter = Router();

// file store local
const upload = multer({
  dest: path.resolve(__dirname, "../../../public/data/uploads"),
  limits: {
    fileSize: 10 * 1024 * 1024, //10MB
  },
});

bookRouter.post(
  "/",
  authenticate,
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  createBook
);

bookRouter.patch(
  "/:bookId",
  authenticate,
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  updateBook
);

bookRouter.get("/", listBooks);
bookRouter.get("/:bookId", getSingleBook);

export default bookRouter;
