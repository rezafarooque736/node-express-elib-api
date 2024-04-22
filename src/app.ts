import express from "express";

const app = express();

// Routes
app.use("/api/v1", (req, res, next) => {
  res.json({ message: "Welcome to elib apis" });
});

export default app;
