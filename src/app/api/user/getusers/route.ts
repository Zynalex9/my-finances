import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../../helpers/connectDB";
import userModel from "../../../../../models/userModel.mode";
import jwt, { JwtPayload } from "jsonwebtoken";

dbConnect();

export async function GET(request: NextRequest) {
  try {
    // Extract the token from cookies
    console.log(request)
    const tokenCookie = request.cookies.get("token"); // Get the cookie object
    console.log(tokenCookie);
    // If no token is found, return an unauthorized response
    if (!tokenCookie || !tokenCookie.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = tokenCookie.value; // Access the actual token string

    // Verify the token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as JwtPayload; // Type assertion
console.log(decoded)
    // Ensure decoded.id is present
    if (!decoded.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Find the user by ID
    const user = await userModel.findById(decoded.id).select("-password"); // Exclude the password field

    // If user is not found, return an error
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the user details
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching user details." },
      { status: 500 }
    );
  }
}
