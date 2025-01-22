import connectDB from "@/lib/dbConnect";
import { ServiceRequestModel, UserModel } from "@/models/user.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export type ProfileFormProps = {
    role: "client" | "service";
    fullname: string;
    phone: string;
    enterpriseName?: string;
    enterpriseAddress?: string;
  };

export async function POST(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

  await connectDB();
  const data = await request.json() as ProfileFormProps;

//   if (!requestId || !isValidObjectId(requestId)) {
//     throw new Error("Invalid Request ID");
//   }
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      {username}, data
    );

    if (!updatedUser ) {
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
        data: updatedUser,
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
