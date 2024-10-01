import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../../helpers/connectDB";
import budgetModel from "../../../../../models/budgetModel.model";
import jwt, { JwtPayload } from "jsonwebtoken";

dbConnect();

export async function POST(request: NextRequest) {
  const reqBody = await request.json();
  const { category, amount, currency, startDate, endDate } = reqBody;
  try {
    const isThereBudget = await budgetModel.findOne({ category });
    if (isThereBudget) {
      return NextResponse.json(
        { success: false, message: `There is already ${category}` },
        { status: 401 }
      );
    }
    const token = request.cookies.get("token");
    const userId = token?.value;
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decoded = jwt.verify(userId, process.env.TOKEN_SECRET!) as JwtPayload;
    const newBudget = new budgetModel({
      userId: decoded?.id,
      category,
      amount,
      currency,
      startDate,
      endDate,
    });
    await newBudget.save();
    return NextResponse.json({
      success: true,
      Message: "Budget added successfully",
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
