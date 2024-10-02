import { NextRequest, NextResponse } from "next/server";
import expensesModel from "../../../../../models/expensesModel.model";
import budgetModel from "../../../../../models/budgetModel.model";

export async function PATCH(request: NextRequest) {
  const reqBody = await request.json();
  const { expenseId, amount } = reqBody;

  try {
    const token = request.cookies.get("token");
    const userId = token?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Find the expense by its ID
    const expense = await expensesModel.findById(expenseId);
    
    if (!expense) {
      return NextResponse.json(
        { success: false, message: "Expense not found" },
        { status: 404 }
      );
    }

    // Find the associated budget
    const budget = await budgetModel.findById(expense.budgetId);
    
    if (!budget) {
      return NextResponse.json(
        { success: false, message: "Budget not found" },
        { status: 404 }
      );
    }

    // Calculate the difference in amount
    const amountDifference = amount - expense.amount;

    // Update the expense amount
    expense.amount = amount;

    await expense.save(); // Save the updated expense

    // Update the budget's remaining amount
    budget.remainingAmount -= amountDifference;
    await budget.save(); // Save the updated budget

    return NextResponse.json({
      success: true,
      message: "Expense amount updated and budget adjusted successfully",
      expense,
      updatedBudget: budget,
    });
  } catch (error: any) {
    console.log("Error updating expense:", error);
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
