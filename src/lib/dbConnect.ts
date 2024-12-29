import mongoose from "mongoose";

type connectionConfig = {
  isConnected?: number;
};

const connection: connectionConfig = {};

async function connectDB() {
  if (connection.isConnected) {
    console.log("Already connected to DB");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.log("Failed to connect to database");
    process.exit(1);
  }
}

export default connectDB
