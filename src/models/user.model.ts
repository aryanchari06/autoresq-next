import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  username: string;
  fullname: string;
  email: string;
  password: string;
  phone: string;
  rating: number;
  avatar: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  role: "client" | "service";
  enterpriseName: string;
  enterpriseAddress: string;
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    match: [/^[a-zA-Z0-9._-]{3,20}$/, "Invalid username"],
    unique: true,
  },
  fullname: {
    type: String,
    required: [true, "Full nane is required"],
    min: [3, "Name should be min 3 characters long"],
  },
  email: {
    type: String,
    required: [true, "Email ID is required"],
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email ID",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    min: [6, "Password should have a minimum length of 6"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
  },
  avatar:{
    type:String,
  },
  rating: {
    type: Number,
  },
  verifyCode: {
    type: String,
    match: [/^\d{6}$/, "Verification code should be exactly 6 digits"],
    required: [true, "Verification Code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verification Code Expiry is required"],
  },
  isVerified: {
    type: Boolean,
    required: [true, "User verification status is required"],
    default: false,
  },
  role: {
    type: String,
    enum: {
      values: ["client", "service"],
    },
  },
  enterpriseName: {
    type: String,
  },
  enterpriseAddress: {
    type: String,
    max: [100, "Enterprise address too long"],
  },
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export interface ServiceRequest extends Document {
  client: mongoose.Types.ObjectId;
  media: string;
  text: string;
  status: "pending" | "accepted" | "ongoing" | "completed";
}

const ServiceRequestSchema = new Schema({
  client: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Client is required"],
  },
  media: {
    type: String,
  },
  text: {
    type: String,
    max: [200, "Text description too long"],
  },
  status: {
    type: String,
    enum: {
      values: ["pending", "accepted", "ongoing", "completed"],
    },
    default: "pending",
  },
});

const ServiceRequestModel =
  (mongoose.models.ServiceRequest as mongoose.Model<ServiceRequest>) ||
  mongoose.model<ServiceRequest>("ServiceRequest", ServiceRequestSchema);

export { UserModel, ServiceRequestModel };
