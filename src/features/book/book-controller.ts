import { Request, Response, NextFunction } from "express";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, author, description, image } = req.body;

    res.status(201).json({
      message: "Book created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export { createBook };
