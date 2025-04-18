import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../common/logger";

dotenv.config();

const mongoURI = process.env.MONGO_URI as string;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
  } catch (error: any) {
    logger.error(error);
    process.exit(1);
  }
};

export default connectDB;
