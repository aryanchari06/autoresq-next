import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.USER_EMAIL_ID,
    pass: process.env.USER_EMAIL_PASSWORD,
  },
});

export async function sendVerificationEmail(
  username: string,
  email: string,
  otp: string
): Promise<any> {
  try {
    const response = await transporter.sendMail({
      from: process.env.USER_EMAIL_ID,
      to: email,
      subject: "AutoResQ User Verification",
      text: `Hello ${username},\n\nYour verification code for AutoResQ is: ${otp}.\nPlease enter this code to verify your account.\n\nThank you,\nAutoResQ Team`, // plain text body
      html: `
        <div style="font-family: Arial, sans-serif; color: #000; background-color: #fff; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #000; border-radius: 10px;">
          <h2 style="text-align: center; color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">Welcome to AutoResQ, ${username}!</h2>
          <p style="color: #000;">Thank you for signing up with AutoResQ. To complete your account verification, please use the verification code below:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #000; border: 1px solid #000; padding: 10px; display: inline-block; border-radius: 5px;">${otp}</span>
          </div>
          <p style="color: #000;">If you did not initiate this request, please ignore this email or contact our support team immediately.</p>
          <p style="color: #000;">Thank you,<br>AutoResQ Team</p>
        </div>
      `,
    });

    if (response.accepted.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Something went wrong while sending verification email",
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Verification email sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while sending verification email: ", error);
    return Response.json(
      {
        success: false,
        message: "Failed to send verification email",
      },
      { status: 500 }
    );
  }
}

export async function sendRequestConfirmationOtp(
  username: string,
  mechanic: string,
  email: string,
  otp: string
): Promise<any> {
  try {
    const response = await transporter.sendMail({
      from: process.env.USER_EMAIL_ID,
      to: email,
      subject: "AutoResQ: Request Confirmation",
      text: `Dear ${username},

            We are pleased to inform you that your request for vehicle repair has been accepted by our service provider, ${mechanic}. They are currently en route to assist you.

            To confirm your request and initiate the repair process, please provide the following confirmation code to your mechanic upon arrival:

            Confirmation Code: ${otp}

            Thank you for choosing AutoResQ. We are dedicated to providing you with reliable and prompt assistance.

            Best regards,
            The AutoResQ Team`, // plain text body
      html: `
        <div style="font-family: Arial, sans-serif; color: #000; background-color: #fff; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #000; border-radius: 10px;">
          <h2 style="text-align: center; color: #333;">AutoResQ: Request Confirmation</h2>
          <p>Dear <strong>${username}</strong>,</p>
          <p>We are pleased to inform you that your request for vehicle repair has been accepted by our service provider, <strong>${mechanic}</strong>. They are currently en route to assist you.</p>
          <p style="font-size: 16px; font-weight: bold; text-align: center; color: #555;">Confirmation Code:</p>
          <p style="font-size: 24px; font-weight: bold; text-align: center; color: #000; margin: 10px 0;">${otp}</p>
          <p>Please provide this code to your mechanic upon arrival to confirm your request and begin the repair process.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <p>Thank you for choosing <strong>AutoResQ</strong>. We are dedicated to providing you with reliable and prompt assistance.</p>
          <p style="font-size: 14px; color: #777; text-align: center; margin-top: 20px;">Best regards,<br>The AutoResQ Team</p>
        </div>
      `,
    });

    if (response.accepted.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Something went wrong while sending the verification email.",
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Verification email sent successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while sending verification email: ", error);
    return Response.json(
      {
        success: false,
        message: "Failed to send verification email.",
      },
      { status: 500 }
    );
  }
}
