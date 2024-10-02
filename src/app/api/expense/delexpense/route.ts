import { NextRequest, NextResponse } from "next/server";
import expensesModel from "../../../../../models/expensesModel.model";
import budgetModel from "../../../../../models/budgetModel.model";

export async function DELETE(request: NextRequest) {
  const { expenseId } = await request.json();

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

    // Update the budget by adding back the expense amount
    budget.remainingAmount += expense.amount; // or budget.amount += expense.amount;
    await budget.save();

    // Delete the expense
    await expensesModel.findByIdAndDelete(expenseId);

    return NextResponse.json({
      success: true,
      message: "Expense deleted and budget updated successfully",
    });
  } catch (error: any) {
    console.log("Error deleting expense:", error);
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
