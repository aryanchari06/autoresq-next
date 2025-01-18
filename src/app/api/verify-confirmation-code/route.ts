import connectDB from "@/lib/dbConnect";
import { ServiceRequestModel } from "@/models/user.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { otp, requestId } = await req.json();

    if (!otp) {
      throw new Error("OTP is missing");
    }
    if (!requestId || !isValidObjectId(requestId)) {
      throw new Error("Invalid request ID");
    }
    const fetchedRequest = await ServiceRequestModel.findById(requestId);
    if (!fetchedRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "Request does not exist",
        },
        { status: 404 }
      );
    }

    if (fetchedRequest.verifyCode !== otp.toString()) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect OTP",
        },
        { status: 400 }
      );
    }

    //otp is correct and verified
    fetchedRequest.status = "ongoing";
    await fetchedRequest.save();

    return NextResponse.json(
      {
        success: true,
        message: "OTP verified successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error while verifying confirmation OTP: ", error);
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Failed to verify confirmation OTP",
        },
        { status: 500 }
      );
    } else {
      console.error("Unknown error while verifying confirmation OTP:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to verify confirmation OTP",
        },
        { status: 500 }
      );
    }
  }
}
