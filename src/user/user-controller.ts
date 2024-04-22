import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

// Register a new user
const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  // validate user input
  if (!name || !email || !password) {
    const err = createHttpError(400, "Please provide all fields");
    return next(err);
  }

  return res.status(200).json({
    message: "User registered successfully",
  });
};

export { registerUser };
