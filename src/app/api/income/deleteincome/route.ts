import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../../helpers/connectDB";
import incomeModel from "../../../../../models/incomeModel.model";
import budgetModel from "../../../../../models/budgetModel.model";
import jwt, { JwtPayload } from "jsonwebtoken";
/* eslint-disable */ import mongoose, { Types } from "mongoose"; /* eslint-disable */

dbConnect();

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const incomeId = searchParams.get("id"); // Assuming income ID is passed as a query parameter.

  try {
    const token = request.cookies.get("token");
    const userId = token?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(userId, process.env.TOKEN_SECRET!) as JwtPayload;
    const userIdFromToken = decoded?.id;

    const userIdObjectId = new Types.ObjectId(userIdFromToken);

    // Find the income entry by ID
    const incomeToDelete = await incomeModel.findById(incomeId);
    if (!incomeToDelete) {
      return NextResponse.json({ message: "Income entry not found." }, { status: 404 });
    }

    // Calculate total income before deletion
    const totalIncomeBeforeDeletion = await incomeModel.aggregate([
      { $match: { userId: userIdObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const userTotalIncomeBefore = totalIncomeBeforeDeletion[0]?.total || 0;

    // Calculate the new total income after deletion
    const userTotalIncomeAfter = userTotalIncomeBefore - incomeToDelete.amount;

    // Delete the income entry
    await incomeModel.findByIdAndDelete(incomeId);

    // Check if any budgets exceed the new income limit
    const existingBudgets = await budgetModel.find({ userId: userIdObjectId });
    
    const budgetsToDelete = existingBudgets.filter(budget => 
      budget.amount > userTotalIncomeAfter
    );

    if (budgetsToDelete.length > 0) {
      const budgetIdsToDelete = budgetsToDelete.map(b => b._id);
      await budgetModel.deleteMany({ _id: { $in: budgetIdsToDelete } });
    }

    return NextResponse.json({
      success: true,
      message: "Income deleted successfully and exceeding budgets removed.",
    });
  } /* eslint-disable */catch (error: any)/* eslint-disable */ {
    console.log("Unexpected error occurred in deleting income:", error);
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
