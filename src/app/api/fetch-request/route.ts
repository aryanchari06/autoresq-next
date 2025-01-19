import connectDB from "@/lib/dbConnect";
import { ServiceRequestModel } from "@/models/user.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      requestId: searchParams.get("request"),
    };

    if (queryParams.requestId === "" || queryParams.requestId === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Request ID",
        },
        { status: 400 }
      );
    }
    // console.log("Params: ", queryParams);

    const serviceRequest = await ServiceRequestModel.aggregate([
      {
        $match: {
          // _id: queryParams.requestId,
          _id: new mongoose.Types.ObjectId(queryParams.requestId),
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
                username: 1,
                fullname: 1,
                avatar: 1,
                email: 1,
                phone: 1,
                coords: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "mechanic",
          foreignField: "_id",
          as: "requestMechanic",
          pipeline: [
            {
              $project: {
                username: 1,
                fullname: 1,
                avatar: 1,
                email: 1,
                phone: 1,
                coords: 1,
                enterpriseName: 1,
                enterpriseAddress: 1,
              },
            },
          ],
        }
      }
    ]);

    // console.log(serviceRequest);

    if (!serviceRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "Request not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Done!",
        request: serviceRequest[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error checking username: ", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username.",
      },
      { status: 500 }
    );
  }
}
