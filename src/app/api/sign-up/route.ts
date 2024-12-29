import connectDB from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "@/lib/nodemailer";

export async function POST(req: Request) {
  await connectDB();
  try {
    const {
      username,
      email,
      password,
      fullname,
      phone,
      role,
      enterpriseName,
      enterpriseAddress,
    } = await req.json();

    console.log(role)

    if (!role || !(role === "client" || role === "service")) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid role",
        },
        { status: 400 }
      );
    }

    if (role === "service") {
      if (!enterpriseAddress || !enterpriseName)
        return NextResponse.json(
          {
            success: false,
            message:
              "Enterprise name and address are required for service providers",
          },
          { status: 400 }
        );
    }

    const existingVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(Math.random() * 900000 + 100000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "User with same email already exists",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcryptjs.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcryptjs.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        fullname,
        password: hashedPassword,
        phone,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        role,
        ...(role === "service" && { enterpriseName, enterpriseAddress }),
      });
      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      username,
      email,
      verifyCode
    );
    console.log("Email response:", emailResponse);

    if (!emailResponse.ok) {
      throw new Error("Error while sending verification email");
    }

    return NextResponse.json(
      {
        success: true,
        message: "User Registered successfully, please verify to sign in!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error signing up the user: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to register user",
      },
      { status: 500 }
    );
  }
}
