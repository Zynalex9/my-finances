import { NextRequest, NextResponse } from "next/server";
import budgetModel from "../../../../../models/budgetModel.model";

export async function PATCH(request: NextRequest) {
  const reqBody = await request.json();
  const { budgetId, newAmount } = reqBody; // Assuming the request body has newAmount

  try {
    const token = request.cookies.get("token");
    const userId = token?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Update the budget directly using findByIdAndUpdate
    const updatedBudget = await budgetModel.findByIdAndUpdate(
      budgetId,
      { amount: newAmount }, // Update the amount to newAmount
      { new: true } // Return the updated document
    );

    if (!updatedBudget) {
      return NextResponse.json(
        { success: false, message: "Budget not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Budget updated successfully",
      updatedBudget, // Return the updated budget
    });
  }
  /* eslint-disable */
   catch (error: any) {
    /* eslint-disable */
    console.log("Error updating budget:", error);
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
