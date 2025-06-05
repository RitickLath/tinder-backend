import mongoose from "mongoose";

export const CONNECTDB: any = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI as string);
    console.log("Database Connected.");
  } catch (error: any) {
    console.log("Error while connecting with database: " + error);
  }
};
