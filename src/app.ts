import express from "express";
import globalErrorHandler from "./middlewares/global-error-handler";
import userRouter from "./user/user-router";

const app = express();
app.use(express.json());

// Routes
app.get("/api/v1", (req, res, next) => {
  res.json({ message: "Welcome to elib apis" });
});

// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/books", booksRoutes);
app.use("/api/v1/users", userRouter);

// global error handler
app.use(globalErrorHandler);

export default app;
