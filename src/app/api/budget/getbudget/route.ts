import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../../helpers/connectDB";
import budgetModel from "../../../../../models/budgetModel.model";
import jwt from "jsonwebtoken";

dbConnect();

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token");
    const userId = token?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(userId, process.env.TOKEN_SECRET!);
    const userIdFromToken = (decoded as { id: string }).id;

    const { searchParams } = new URL(request.url);
    let category: string | null = searchParams.get("category");

    if (category) {
      category = category.toLowerCase();
    }

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category is required" },
        { status: 400 }
      );
    }

    const budget = await budgetModel.findOne({
      userId: userIdFromToken,
      category: category,
    });

    if (!budget) {
      return NextResponse.json(
        {
          success: false,
          message: `Budget for category '${category}' not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Budget for category '${category}' found`,
        budget,
      },
      { status: 200 }
    );
  } /* eslint-disable */catch (error: any)/* eslint-disable */ {
    console.error("Error retrieving budget:", error);
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
