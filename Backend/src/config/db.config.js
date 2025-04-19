import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    // console.log("Connected to DB: ", connectionInstance.connection.host);
  } catch (error) {
    console.error("Failed to connectDB: ", error);
    process.exit(1);
  }
};

export default connectDB;
