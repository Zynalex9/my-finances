import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../../helpers/connectDB";
import userModel from "../../../../../models/userModel.mode";
import bcrypt from "bcryptjs";

dbConnect();

export async function POST(request: NextRequest) {
  const reqBody = await request.json();
  const { displayName, username, email, password, currency } = reqBody; // Changed 'preferredCurrency' to 'currency'

  try {
    const user = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (user) {
      return NextResponse.json(
        {
          success: false, // Changed to false to better represent the failure
          message: "Username or email already exists",
        },
        { status: 401 }
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      displayName,
      username,
      email,
      password: hashPassword,
      currency, // Store currency as received
    });

    const savedUser = await newUser.save();
    console.log("New User:", newUser);
    return NextResponse.json(
      {
        success: true,
        message: "User Registered",
        savedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Unexpected error occurred in registering a user", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
