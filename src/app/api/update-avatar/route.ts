import connectDB from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await connectDB();
  try {
    const { userId, imgUrl } = await request.json();

    // const updatedUser = await UserModel.updateOne(
    //   { _id: userId }, // Find the user by ID
    //   { $set: { avatar: imgUrl } } // Update the avatar field
    // );

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          avatar: imgUrl, // Correct syntax
        },
      },
      { new: true } // Option to return the updated document
    );

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Something went wrong while updating user details",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User avatar updated successfully!",
        user: updatedUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error updating user image");
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update user avatar",
      },
      { status: 400 }
    );
  }
}
