import path from "node:path";
import { Router } from "express";
import { createBook } from "./book-controller";
import multer from "multer";

const bookRouter = Router();

// file store local
const upload = multer({
  dest: path.resolve(__dirname, "../../../public/data/uploads"),
  limits: {
    fileSize: 1024 * 1024 * 3, //3MB
  },
});

bookRouter.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

export default bookRouter;
