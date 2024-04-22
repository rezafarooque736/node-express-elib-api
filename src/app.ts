import express from "express";
import globalErrorHandler from "./middlewares/global-error-handler";

const app = express();

// Routes
app.get("/api/v1", (req, res, next) => {
  res.json({ message: "Welcome to elib apis" });
});

// global error handler
app.use(globalErrorHandler);

export default app;
