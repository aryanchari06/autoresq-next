import connectDB from "@/lib/dbConnect";
import { sendRequestConfirmationOtp } from "@/lib/nodemailer";
import { ServiceRequestModel, UserModel } from "@/models/user.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { requestId, mechanicId } = await req.json();
  const verifyCode = Math.floor(Math.random() * 600000 + 100000);
  const verifyCodeExpiry = new Date();
  verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);

  await connectDB();

  try {
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      console.log("Invalid request ID: ", requestId);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request ID",
        },
        { status: 400 }
      );
    }

    const updatedRequest = await ServiceRequestModel.findOneAndUpdate(
      { _id: requestId },
      {
        status: "accepted",
        mechanic: mechanicId,
        verifyCode,
        verifyCodeExpiry,
      },
      { new: true }
    ).populate("mechanic", "fullname username phone avatar email");

    if (!updatedRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "Request not found",
        },
        { status: 404 }
      );
    }

    const client = await UserModel.findById(updatedRequest?.client);

    if (!client || !client.email) {
      console.error("Client information or email is missing.");
      return NextResponse.json(
        {
          success: false,
          message: "Could not find client information.",
        },
        { status: 400 }
      );
    }

    const mechanicUsername = updatedRequest?.mechanic?.username || "Mechanic";
    const sendOTP = await sendRequestConfirmationOtp(
      client.username || "User",
      mechanicUsername,
      client.email,
      verifyCode.toString()
    );

    if (!sendOTP) {
      return NextResponse.json(
        {
          message: "Could not send confirmation email",
          success: false,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Request updated successfully!",
        data: updatedRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while accepting request: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to accept user request",
      },
      { status: 500 }
    );
  }
}
