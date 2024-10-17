import { NextRequest, NextResponse } from "next/server";
import budgetModel from "../../../../../models/budgetModel.model";
import jwt from "jsonwebtoken";
import { dbConnect } from "../../../../../helpers/connectDB";
dbConnect()
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token");
    const userId = token?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(userId, process.env.TOKEN_SECRET!);
    const userIdFromToken = (decoded as { id: string }).id;

    const allBudgets = await budgetModel
      .find({ userId: userIdFromToken })
      .populate("userId", "displayName email");
    console.log(userIdFromToken);
    return NextResponse.json({ success: true, budgets: allBudgets });
  } /* eslint-disable */catch (error: any)/* eslint-disable */ {
    console.error("Error retrieving budgets:", error);
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
