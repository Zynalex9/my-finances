import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../../helpers/connectDB";
import incomeModel from "../../../../../models/incomeModel.model";
import jwt, { JwtPayload } from "jsonwebtoken";

dbConnect();

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token");
    const userId = token?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(userId, process.env.TOKEN_SECRET!) as JwtPayload;
    const userIdFromToken = decoded?.id;

    // Fetch all incomes for the user
    const incomes = await incomeModel.find({ userId: userIdFromToken });

    return NextResponse.json({
      success: true,
      incomes,
    });
  } /* eslint-disable */catch (error: any)/* eslint-disable */ {
    console.log("Unexpected error occurred in fetching incomes:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
