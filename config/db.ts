import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("MongoDB Database is Connected.");
  });
  await mongoose.connect(process.env.MONGODB_URI as string);
};

export default connectDB;
