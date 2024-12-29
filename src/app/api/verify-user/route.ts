import connectDB from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { username, verifyCode } = await req.json();
    const decodedUsername = decodeURIComponent(username);
    const existingUser = await UserModel.findOne({ username: decodedUsername });
    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User does not exist",
        },
        { status: 404 }
      );
    }

    const isCodeValid = existingUser.verifyCode === verifyCode;
    const isCodeNotExpired =
      new Date(existingUser.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      existingUser.isVerified = true;
      await existingUser.save();
      return NextResponse.json(
        {
          success: true,
          message: "User verified successfully!",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification code has expired",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Verification code is incorrect",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error while verifying user: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify user",
      },
      { status: 500 }
    );
  }
}
