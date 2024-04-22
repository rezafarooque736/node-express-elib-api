import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import UserModel from "./user-model";
import { hash } from "bcrypt";

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

  // Database call
  const user = await UserModel.findOne({ email });
  if (user) {
    const err = createHttpError(400, "User already exists");
    return next(err);
  }

  // password hash
  const hashedPassword = await hash(password, 10);

  return res.status(200).json({
    message: "User registered successfully",
  });
};

export { registerUser };
