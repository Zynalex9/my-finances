import { NextRequest, NextResponse } from "next/server";
import budgetModel from "../../../../../models/budgetModel.model";
import expensesModel from "../../../../../models/expensesModel.model";

export async function DELETE(request: NextRequest) {
  const { budgetId } = await request.json();

  try {
    const token = request.cookies.get("token");
    const userId = token?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Find the budget by its ID
    const budget = await budgetModel.findById(budgetId);

    if (!budget) {
      return NextResponse.json(
        { success: false, message: "Budget not found" },
        { status: 404 }
      );
    }

    // Delete all expenses associated with this budget
    await expensesModel.deleteMany({ budgetId });
    await budgetModel.findByIdAndDelete(budgetId);
    return NextResponse.json({
      success: true,
      message: "Budget and associated expenses deleted successfully",
    });
  } /* eslint-disable */catch (error: any)/* eslint-disable */
   {
    console.log("Error deleting budget:", error);
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
