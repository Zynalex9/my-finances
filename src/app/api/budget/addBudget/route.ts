import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../../helpers/connectDB";
import budgetModel from "../../../../../models/budgetModel.model";
import incomeModel from "../../../../../models/incomeModel.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose, { Types } from "mongoose"; 

dbConnect();

export async function POST(request: NextRequest) {
  const reqBody = await request.json();
  const { category, amount: rawAmount, currency, startDate, endDate } = reqBody;
  const amount = Number(rawAmount);

  try {
    const token = request.cookies.get("token");
    const userId = token?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(userId, process.env.TOKEN_SECRET!) as JwtPayload;
    const userIdFromToken = decoded?.id;

    const userIdObjectId = new Types.ObjectId(userIdFromToken);
    console.log("userIdObjectId", userIdObjectId);
    const totalIncome = await incomeModel.aggregate([
      { $match: { userId: userIdObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const userTotalIncome = totalIncome[0]?.total || 0;
    console.log("userTotalIncome", userTotalIncome);

    if (userTotalIncome <= 0) {
      return NextResponse.json(
        { success: false,
           message: "Total income must be greater than 0." },
        { status: 400 }
      );
    }

    const existingBudget = await budgetModel.findOne({
      userId: userIdObjectId,
      category,
    });
    if (existingBudget) {
      return NextResponse.json(
        {
          success: false,
          message: `Budget already exists for category ${category}`,
        },
        { status: 401 }
      );
    }

    const existingBudgets = await budgetModel.find({ userId: userIdObjectId }); // Use ObjectId here
    const totalBudgetAmount = existingBudgets.reduce(
      (sum, budget) => sum + budget.amount,
      0
    );

    if (totalBudgetAmount + amount > userTotalIncome) {
      return NextResponse.json(
        { success: false, message: "Total budget cannot exceed total income." },
        { status: 400 }
      );
    }

    const newBudget = new budgetModel({
      userId: userIdObjectId,
      category,
      amount,
      currency,
      startDate,
      endDate,
    });

    await newBudget.save();

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
