import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI as string;

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
  } catch (error) {
    process.exit(1);
  }
};
