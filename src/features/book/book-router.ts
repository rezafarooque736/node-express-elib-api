import { Router } from "express";
import { createBook } from "./book-controller";

const bookRouter = Router();

bookRouter.post("/", createBook);

export default bookRouter;
