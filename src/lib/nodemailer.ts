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
