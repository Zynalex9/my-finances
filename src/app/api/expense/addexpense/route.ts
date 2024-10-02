import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../../helpers/connectDB";
import expensesModel from "../../../../../models/expensesModel.model";
import budgetModel from "../../../../../models/budgetModel.model";
import jwt, { JwtPayload } from "jsonwebtoken";

dbConnect();

export async function POST(request: NextRequest) {
  const reqBody = await request.json();
  const { budgetId, category, amount, currency, description, spendingDate } = reqBody;

  try {
    const token = request.cookies.get("token");
    const userId = token?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(userId, process.env.TOKEN_SECRET!) as JwtPayload;
    const userIdFromToken = decoded?.id;

    const budget = await budgetModel.findById(budgetId);

    if (!budget) {
      return NextResponse.json(
        { success: false, message: "Budget not found" },
        { status: 404 }
      );
    }

    // Ensure the category and currency match the budget
    if (budget.category !== category) {
      return NextResponse.json(
        { success: false, message: "Category mismatch with budget" },
        { status: 400 }
      );
    }

    if (budget.currency !== currency) {
      return NextResponse.json(
        { success: false, message: "Currency mismatch with budget" },
        { status: 400 }
      );
    }

    // Calculate remaining amount before checking
    await budget.calculateRemainingAmount(); // Calculate the remaining amount

    // Check if the expense exceeds the remaining amount in the budget
    if (budget.remainingAmount < amount) {
      return NextResponse.json(
        { success: false, message: "Expense exceeds remaining budget" },
        { status: 400 }
      );
    }

    const newExpense = new expensesModel({
      userId: userIdFromToken,
      budgetId,
      category,
      amount,
      currency,
      description,
      spendingDate,
    });

    await newExpense.save();

    // Update the remaining amount of the budget
    budget.remainingAmount -= amount;
    await budget.save();

    return NextResponse.json({
      success: true,
      message: "Expense added and budget updated successfully",
      expense: newExpense,
      updatedBudget: budget,
    });

  } catch (error: any) {
    console.log("Error adding expense:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
