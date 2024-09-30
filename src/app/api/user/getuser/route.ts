import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../../helpers/connectDB";
import userModel from "../../../../../models/userModel.mode";
import jwt, { JwtPayload } from "jsonwebtoken";

dbConnect();

export async function GET(request: NextRequest) {
  try {
    const tokenCookie = request.cookies.get("token");
    if (!tokenCookie || !tokenCookie.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = tokenCookie.value;
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as JwtPayload;
    if (!decoded.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching user details." },
      { status: 500 }
    );
  }
}
