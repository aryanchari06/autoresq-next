import connectDB from "@/lib/dbConnect";
import { ServiceRequestModel } from "@/models/user.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectDB();
  const { requestId } = await request.json();
  console.log("REquest id: ",requestId)

  if (!requestId || !isValidObjectId(requestId)) {
    throw new Error("Invalid Request ID");
  }
  try {
    const updatedRequest = await ServiceRequestModel.findByIdAndUpdate(
      requestId,
      {
        status: "completed",
      },
      {
        new: true,
      }
    );

    if (!updatedRequest?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Something went wrong while updating request",
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error while updating task completion", error.message);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update task completion",
        },
        { status: 500 }
      );
    }
  }
}
