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

export interface MediaItem {
  name: string; // Name of the file
  size: number; // File size in bytes
  key: string; // Unique identifier for the file
  lastModified?: number; // Optional timestamp for last modification
  type: string; // MIME type of the file
  url: string; // URL to access the file
  appUrl: string; // URL for app-specific access
  customId?: string | null; // Optional custom identifier
  fileHash: string; // Hash of the file content
  serverData?: any; // Optional server-specific metadata
}

export interface Client {
  avatar: string;
  username: string;
  fullname: string;
  phone: string;
  email: string;
}

export interface Coords {
  lat: string;
  long: string;
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
  avatar: {
    type: String,
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

export interface ServiceProvider {
  _id: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  email: string;
  rating: number;
}

export interface ServiceRequest extends Document {
  client: mongoose.Types.ObjectId;
  media: MediaItem[];
  title: string;
  description: string;
  status: "pending" | "accepted" | "ongoing" | "completed";
  coords: Coords;
  requestOwner: Client;
  mechanic?: mongoose.Types.ObjectId;
  requestMechanic: User;
  verifyCode: string;
  verifyCodeExpiry: Date;
  // mechanic?: User;
}

const ServiceRequestSchema = new Schema({
  client: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Client is required"],
  },
  media: [
    {
      name: { type: String, required: true },
      size: { type: Number, required: true },
      key: { type: String, required: true },
      lastModified: { type: Number },
      type: { type: String, required: true },
      url: { type: String, required: true },
      appUrl: { type: String, required: true },
      customId: { type: String, default: null },
      fileHash: { type: String, required: true },
      serverData: { type: Schema.Types.Mixed },
    },
  ],
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: {
    type: String,
    max: [300, "Text description too long"],
  },
  status: {
    type: String,
    enum: {
      values: ["pending", "accepted", "ongoing", "completed"],
    },
    default: "pending",
  },
  coords: {
    lat: { type: Number, required: true },
    long: { type: Number, required: true },
  },
  requestOwner: {
    avatar: {
      type: String,
    },
    username: {
      type: String,
    },
    fullname: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  mechanic: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  requestMechanic: {
    avatar: {
      type: String,
    },
    username: {
      type: String,
    },
    fullname: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    rating: {
      type: Number,
    },
  },
  verifyCode: {
    type: String,
    // required: [true, "Verification OTP is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    // required: [true, "Verification OTP Expiry is required"],
  },
});

const ServiceRequestModel =
  (mongoose.models.ServiceRequest as mongoose.Model<ServiceRequest>) ||
  mongoose.model<ServiceRequest>("ServiceRequest", ServiceRequestSchema);

export { UserModel, ServiceRequestModel };
