import { NextFunction, Request, Response } from "express";

// Register a new user
const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({
    message: "User Created",
  });
};

export { registerUser };
