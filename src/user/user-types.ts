import { Document } from "mongoose";

export interface UserProps extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
}
