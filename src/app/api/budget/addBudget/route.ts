import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../../helpers/connectDB";
import budgetModel from "../../../../../models/budgetModel.model";
import jwt, { JwtPayload } from "jsonwebtoken";

dbConnect();

export async function POST(request: NextRequest) {
  const reqBody = await request.json();
  const { category, amount, currency, startDate, endDate } = reqBody;

  try {
    const token = request.cookies.get("token");
    const userId = token?.value;
    
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const decoded = jwt.verify(userId, process.env.TOKEN_SECRET!) as JwtPayload;
    const userIdFromToken = decoded?.id;

    const isThereBudget = await budgetModel.findOne({ userId: userIdFromToken, category });
    
    if (isThereBudget) {
      return NextResponse.json(
        { success: false, message: `Budget already exists for category ${category}` },
        { status: 401 }
      );
    }

    // Create a new budget entry
    const newBudget = new budgetModel({
      userId: userIdFromToken,
      category,
      amount,
      currency,
      startDate,
      endDate,
    });

    await newBudget.save();

    // Calculate remaining amount immediately after saving
    await newBudget.calculateRemainingAmount();

    return NextResponse.json({
      success: true,
      message: "Budget added successfully",
      budget: newBudget, 
    });

  } catch (error: any) {
    console.log("Unexpected error occurred in adding budget:", error);
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
