import connectDB from "@/lib/dbConnect";
import { ServiceRequestModel } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();
  console.log(req);
  const { title, description, media, client, coords } = await req.json();
  console.log(coords);

  if (!title || !description || !client || !coords) {
    throw new Error("All fields are required");
  }
  try {
    
    const newRequest = new ServiceRequestModel({
      title,
      description,
      media,
      client: client._id,
      status: "pending",
      coords,
    });

    await newRequest.save();

    return NextResponse.json(
      {
        success: true,
        message: "Service request generated successfully!",
        request: newRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error while creating service request:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate service request",
      },
      { status: 500 }
    );
  }
}
