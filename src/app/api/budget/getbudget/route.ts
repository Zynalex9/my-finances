import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../../helpers/connectDB";
import budgetModel from "../../../../../models/budgetModel.model";
import jwt from "jsonwebtoken";

dbConnect();

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token");
    const userId = token?.value;

    // Check if token exists
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify the token
    const decoded = jwt.verify(userId, process.env.TOKEN_SECRET!);
    const userIdFromToken = (decoded as { id: string }).id;

    // Get category from query params
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    // Check if category is provided
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category is required" },
        { status: 400 }
      );
    }

    // Find budget by userId and category
    const budget = await budgetModel.findOne({
      userId: userIdFromToken,
      category: category,
    });

    // If budget not found, return 404
    if (!budget) {
      return NextResponse.json(
        { success: false, message: `Budget for category '${category}' not found` },
        { status: 404 }
      );
    }

    // Return the found budget
    return NextResponse.json(
      { success: true, message: `Budget for category '${category}' found`, budget },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error retrieving budget:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
