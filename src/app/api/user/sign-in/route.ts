import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../../helpers/connectDB";
import userModel from "../../../../../models/userModel.mode";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dbConnect();
export async function POST(request: NextRequest) {
  const reqBody = await request.json();
  const { email, password } = reqBody;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found. Invalid email",
          success: false,
        },
        { status: 401 } // Use 401 for unauthorized access
      );
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        {
          message: "Invalid Password",
          success: false,
        },
        { status: 401 } // Use 401 for unauthorized access
      );
    }
    
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error: any) {
    console.log("Unexpected error occurred in registering a user", error);
  }
}
