import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./user-model";
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../../config/config";
import { IUser } from "./user-types";

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

  let newUser: IUser;

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
    res.status(201).json({
      message: "User registered successfully",
      id: newUser._id,
      accessToken: token,
    });
  } catch (error) {
    const err = createHttpError(500, "Error while signing the jwt");
    return next(err);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // validate user input
  if (!email || !password) {
    const err = createHttpError(400, "All fileds are required");
    return next(err);
  }

  let user;

  try {
    // database call
    // check if user exists in database or not
    user = await userModel.findOne({ email });
    if (!user) {
      const err = createHttpError(404, "User not found");
      return next(err);
    }
  } catch (error) {
    const err = createHttpError(
      500,
      "Error while getting user from the database"
    );
    return next(err);
  }

  const isPasswordMatch = await compare(password, user.password);

  if (!isPasswordMatch) {
    const err = createHttpError(400, "Invalid password");
    return next(err);
  }
  try {
    // generate jwt token
    const token = sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });

    // send response
    res.status(200).json({
      message: "User logged in successfully",
      id: user._id,
      accessToken: token,
    });
  } catch (error) {
    const err = createHttpError(500, "Error while signing the jwt");
    return next(err);
  }
};

export { registerUser, loginUser };
