import path from "node:path";
import fs from "node:fs";
import { Request, Response, NextFunction } from "express";
import cloudinary from "../../config/cloudinary";
import createHttpError from "http-errors";
import bookModel from "./book-model";
import { AuthRequest } from "../../middlewares/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, genre } = req.body;

    const files = req.files as { [filename: string]: Express.Multer.File[] };

    // upload cover image
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const coverImageFileName = files.coverImage[0].filename;
    const coverImageFilePath = path.resolve(
      __dirname,
      "../../../public/data/uploads",
      coverImageFileName
    );

    const coverImageUploadResult = await cloudinary.uploader.upload(
      coverImageFilePath,
      {
        filename_override: coverImageFileName,
        folder: "book-covers",
        format: coverImageMimeType,
      }
    );

    // upload book file
    const bookMimeType = files.file[0].mimetype.split("/").at(-1);
    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../../public/data/uploads",
      bookFileName
    );

    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: bookMimeType,
      }
    );

    const _req = req as AuthRequest;
    const newBook = await bookModel.create({
      title,
      genre,
      author: _req.userId,
      coverImage: coverImageUploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });

    try {
      // delete temporary files
      await fs.promises.unlink(coverImageFilePath);
      await fs.promises.unlink(bookFilePath);
    } catch (error) {
      const err = createHttpError(500, "Error while deleting temporary files");
      return next(err);
    }

    res.status(201).json({
      message: "Book created successfully",
      id: newBook._id,
    });
  } catch (error) {
    const err = createHttpError(
      500,
      "Error while uploading files to cloudinary"
    );
    return next(err);
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const { bookId } = req.params;

  const book = await bookModel.findById(bookId);

  if (!book) {
    const err = createHttpError(404, "Book not found");
    return next(err);
  }

  const _req = req as AuthRequest;
  // check access
  if (book.author.toString() !== _req.userId.toString()) {
    const err = createHttpError(
      403,
      "You are unauthorised to update this book"
    );
    return next(err);
  }

  // check if image field exists
  const files = req.files as { [filename: string]: Express.Multer.File[] };

  let completeCoverImage = "";
  if (files.coverImage) {
    const filename = files.coverImage[0].filename;
    const coverMImeType = files.coverImage[0].mimetype.split("/").at(-1);

    // send files to cloudinary
    const filePath = path.resolve(
      __dirname,
      "../../../public/data/uploads",
      filename
    );

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: filename,
      folder: "book-covers",
      format: coverMImeType,
    });

    completeCoverImage = uploadResult.secure_url;
    await fs.promises.unlink(filePath);
  }

  // check if file field exists
  let completeFileName = "";
  if (files.file) {
    const filename = files.file[0].filename;
    const fileMImeType = files.file[0].mimetype.split("/").at(-1);

    // send files to cloudinary
    const filePath = path.resolve(
      __dirname,
      "../../../public/data/uploads",
      filename
    );

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: filename,
      folder: "book-pdfs",
      format: fileMImeType,
      resource_type: "raw",
    });

    completeFileName = uploadResult.secure_url;
    await fs.promises.unlink(filePath);
  }

  const updateBook = await bookModel.findByIdAndUpdate(
    bookId,
    {
      title,
      genre,
      coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
      file: completeFileName ? completeFileName : book.file,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    message: "Book updated successfully",
    updateBook,
  });
};

const listBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: add pagination using mongoose pagination package
    const books = await bookModel.find();

    res.status(200).json({
      message: "Books fetched successfully",
      books,
    });
  } catch (error) {
    const err = createHttpError(
      500,
      "Error while getting books from the database"
    );
    return next(err);
  }
};

export { createBook, updateBook, listBooks };
