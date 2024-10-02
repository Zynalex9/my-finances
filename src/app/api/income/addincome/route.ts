import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../../helpers/connectDB";
import incomeModel from "../../../../../models/incomeModel.model";
import jwt, { JwtPayload } from "jsonwebtoken";

dbConnect();

export async function POST(request: NextRequest) {
  const reqBody = await request.json();
  const { source, amount, currency, date } = reqBody;

  try {
    const token = request.cookies.get("token");
    const userId = token?.value;
    
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const decoded = jwt.verify(userId, process.env.TOKEN_SECRET!) as JwtPayload;
    const userIdFromToken = decoded?.id;

    // Create a new income entry
    const newIncome = new incomeModel({
      userId: userIdFromToken,
      source,
      amount,
      currency,
      date, // Date of the income, if not provided, will use the current date
    });

    await newIncome.save();

    return NextResponse.json({
      success: true,
      message: "Income added successfully",
      income: newIncome,
    });

  } catch (error: any) {
    console.log("Unexpected error occurred in adding income:", error);
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
