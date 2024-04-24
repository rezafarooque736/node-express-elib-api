import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthRequest extends Request {
  userId: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");

  if (!token) {
    const err = createHttpError(401, "Authorization token is required");
    return next(err);
  }

  try {
    const parsedToken = token.split(" ")[1];
    const decodedToken = verify(parsedToken, config.jwtSecret as string);
    const _req = req as AuthRequest;

    // add userId to request object
    _req.userId = decodedToken.sub as string;

    next();
  } catch (error) {
    const err = createHttpError(401, "Invalid token / Token Expired");
    return next(err);
  }
};

export default authenticate;
