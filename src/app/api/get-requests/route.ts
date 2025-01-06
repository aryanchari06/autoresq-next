import connectDB from "@/lib/dbConnect";
import { ServiceRequestModel } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  try {
    // const requests = await ServiceRequestModel.find({ status: "pending" });
    const requests = await ServiceRequestModel.aggregate([
      {
        $match: {
          status: "pending",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "client",
          foreignField: "_id",
          as: "requestOwner",
          pipeline: [
            {
              $project: {
                password: 0,
                isVerified: 0,
                verifyCode: 0,
                verifyCodeExpiry: 0,
                role: 0,
              },
            },
          ],
        },
      },
    ]);

    if (!requests) {
      return NextResponse.json(
        {
          success: false,
          message: "Something went wrong whule fetching requests",
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Requests fetched successfully!",
        requests,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to fetch requests");
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch requests",
      },
      { status: 500 }
    );
  }
}
