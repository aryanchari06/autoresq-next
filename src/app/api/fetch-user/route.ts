
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";

export async function GET(request:NextRequest) {
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is required",
        },
        { status: 400 }
      );
    }

    const user = await UserModel.aggregate([
      {
        $match: {
          username: username, // Match the string username directly
        },
      },
      {
        $project: {
          verifyCode: 0,
          verifyCodeExpiry : 0,
          password: 0,
          isVerified: 0,
        }
      },
      {
        $addFields: {
          rating: {
            $round: [{ $avg: "$ratings" }, 1],
          },
        },
      },
    ]);

    if (user.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User does not exist",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User fetched successfully!",
        data: user[0], // Return the first user (since aggregate returns an array)
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Failed to fetch user`,
      },
      { status: 500 }
    );
  }
}

