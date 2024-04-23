import path from "node:path";
import { Request, Response, NextFunction } from "express";
import cloudinary from "../../config/cloudinary";
import createHttpError from "http-errors";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("files", req.files);

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
      coverImageFileName
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

    console.log({ coverImageUploadResult, bookFileUploadResult });

    res.status(201).json({
      message: "Book created successfully",
    });
  } catch (error) {
    const err = createHttpError(
      500,
      "Error while uploading files to cloudinary"
    );
    next(err);
  }
};

export { createBook };
