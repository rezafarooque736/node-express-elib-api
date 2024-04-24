import express from "express";
import globalErrorHandler from "./middlewares/global-error-handler";
import userRouter from "./features/user/user-router";
import bookRouter from "./features/book/book-router";
import cors from "cors";
import { config } from "./config/config";

const app = express();

//
app.use(
  cors({
    origin: config.frontEndDomain,
  })
);

app.use(express.json());

// Routes
app.get("/api/v1", (req, res, next) => {
  res.json({ message: "Welcome to elib apis" });
});

// Routes
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/users", userRouter);

// global error handler
app.use(globalErrorHandler);

export default app;
