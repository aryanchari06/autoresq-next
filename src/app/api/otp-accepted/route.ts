import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const request = await req.json()
    console.log("Reuqsr",request)
  const Response = fetch(
    `${process.env.NEXT_PUBLIC_SOCKETSERVER_URL}/otp-accepted/${request.id}` ||
      "http://localhost:3001/otp-accepted"
  );

  return NextResponse.json(
    {
      success: true,
      message: "OTP verified",
      data: Response
    },
    { status: 200 }
  );
}
