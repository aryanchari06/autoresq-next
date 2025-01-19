import connectDB from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await connectDB();
  const { star } = await request.json();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      mechanicId: searchParams.get("user"),
    };

    if (!queryParams.mechanicId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Mechanic ID",
        },
        { status: 400 }
      );
    }

    // Push the star rating into the ratings array
    const updatedUser = await UserModel.findByIdAndUpdate(
      queryParams.mechanicId,
      {
        $push: { ratings: star }, // Use $push to add the star rating to the array
      },
      { new: true } // Return the updated document
    );

    return NextResponse.json(
      {
        success: true,
        message: "Mechanic ratings updated!",
        data: updatedUser, // Optionally return the updated user data
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding rating: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error adding rating.",
      },
      { status: 500 }
    );
  }
}
