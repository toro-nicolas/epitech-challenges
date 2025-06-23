import mongoose from "mongoose";
import dotenv from "dotenv";



dotenv.config();

let db_uri: string = process.env.MONGODB_URI as string;

export async function connect(): Promise<void> {
  try {
    await mongoose.connect(db_uri + "/account");
    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
}
