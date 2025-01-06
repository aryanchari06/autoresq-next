import connectDB from "@/lib/dbConnect";
import { ServiceRequestModel } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      requestId: searchParams.get("request"),
    };

    if (queryParams.requestId === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Request ID",
        },
        { status: 400 }
      );
    }
    // console.log("Params: ", queryParams);

    const serviceRequest = await ServiceRequestModel.findById(
      queryParams.requestId
    );

    console.log(serviceRequest);

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
        request: serviceRequest,
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
