import { Schema, model, models, Model } from "mongoose";
import { IBook } from "./book-types";
import { title } from "process";

const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const bookModel =
  (models.book as Model<IBook>) || model<IBook>("book", bookSchema);

export default bookModel;
