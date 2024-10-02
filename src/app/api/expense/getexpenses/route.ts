import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import expensesModel from "../../../../../models/expensesModel.model";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token");
    const tokenId = token?.value;
    if (!tokenId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decoded = jwt.verify(
      tokenId,
      process.env.TOKEN_SECRET!
    ) as JwtPayload;
    const userId = decoded?.id;
    const allExpenses = await expensesModel.find({ userId });
    if (!allExpenses) {
      return NextResponse.json(
        { message: "No expenses found for this user" },
        { status: 404 }
      );
    }
    return NextResponse.json({
        success: true,
        allExpenses, // Return the found expenses
      });
    } catch (error: any) {
      console.log("Error fetching expenses:", error);
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