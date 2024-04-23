import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./user-model";
import { hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { UserProps } from "./user-types";

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
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const err = createHttpError(400, "User already exists");
      return next(err);
    }
  } catch (error) {
    const err = createHttpError(
      500,
      "Error while getting user from the database"
    );
    return next(err);
  }

  // password hash
  const hashedPassword = await hash(password, 10);

  let newUser: UserProps;

  try {
    // Create a new user
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch {
    const err = createHttpError(500, "Error while creating a new user");
    return next(err);
  }

  try {
    // Token generation using JWT, and send it to the client as a cookie
    // first parameter is the payload, second is the secret key and third is the options
    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });

    // Send response
    return res.status(201).json({
      message: "User registered successfully",
      id: newUser._id,
      accessToken: token,
    });
  } catch (error) {
    const err = createHttpError(500, "Error while signing the jwt");
    return next(err);
  }
};

export { registerUser };
