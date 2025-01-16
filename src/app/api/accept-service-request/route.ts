import connectDB from "@/lib/dbConnect";
import { ServiceRequestModel } from "@/models/user.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { requestId, mechanicId } = await req.json();
  await connectDB();
  try {
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      console.log("Invalid request id: ", requestId);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request ID",
        },
        { status: 400 }
      );
    }

    const updatedRequest = await ServiceRequestModel.findByIdAndUpdate(
      requestId,
      {
        status: "accepted",
        mechanic: mechanicId,
      },
      { new: true }
    );

    if (!updatedRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "Request not found",
        },
        { status: 404 }
      );
    }

    const populatedRequest = await ServiceRequestModel.populate(
      updatedRequest,
      {
        path: "mechanic",
        select: "-password -isVerified -verifyCode -verifyCodeExpiry -role",
      }
    );

    if (!populatedRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "Something went wrong while adding mechanic details ",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Request updated successfully!",
        data: populatedRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while accepting request: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to accept user request",
      },
      { status: 500 }
    );
  }
}
