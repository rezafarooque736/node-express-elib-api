import mongoose from "mongoose";
import { config } from "./config";

const connectToMongoDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected to database successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.log("Error in connecting to database", err);
    });

    await mongoose.connect(config.databaseUrl as string);
  } catch (err) {
    console.error("Failed to connect to mongo db database", err);
    process.exit(1);
  }
};

export default connectToMongoDB;
