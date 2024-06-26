import { Model, Schema, model, models } from "mongoose";
import { IUser } from "./user-types";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      // Email Validation as per RFC2822 standards.
      match: [
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
        "Please use a vlid emailm address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      // - at least 8 characters
      // - must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number
      // - Can contain special characters
      match: [
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
        "Please use a vlid emailm address",
      ],
    },
  },
  {
    timestamps: true,
  }
);

const userModel =
  (models.user as Model<IUser>) || model<IUser>("User", userSchema);

export default userModel;
