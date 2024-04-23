import { Document } from "mongoose";
import { IUser } from "../user/user-types";

export interface IBook extends Document {
  _id: string;
  title: string;
  author: IUser;
  genre: string;
  coverImage: string;
  file: string;
  createdAt: Date;
  updatedAt: Date;
}
