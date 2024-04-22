import express from "express";
import globalErrorHandler from "./middlewares/global-error-handler";
import usersRouters from "./user/users-routers";

const app = express();

// Routes
app.get("/api/v1", (req, res, next) => {
  res.json({ message: "Welcome to elib apis" });
});

// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/books", booksRoutes);
app.use("/api/v1/users", usersRouters);

// global error handler
app.use(globalErrorHandler);

export default app;
