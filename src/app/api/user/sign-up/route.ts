import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../../helpers/connectDB";
import userModel from "../../../../../models/userModel.mode";
import bcrypt from "bcryptjs";
dbConnect();
export async function POST(request: NextRequest) {
  const reqBody = await request.json();
  const { displayName, username, email, password, preferredCurrency } = reqBody;
  try {
    const user = await userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (user) {
      return NextResponse.json(
        {
          success: true,
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
      preferredCurrency,
    });
    const savedUser = await newUser.save();
    return NextResponse.json(
      {
        success: true,
        message: "User Registered",
        savedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Unexpected error occured in registering an user");
  }
}
