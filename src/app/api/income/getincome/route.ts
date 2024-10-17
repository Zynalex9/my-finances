import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../../helpers/connectDB";
import incomeModel from "../../../../../models/incomeModel.model";
dbConnect()
import jwt, { JwtPayload } from "jsonwebtoken";
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source");
  
    try {
      const token = request.cookies.get("token");
      const userId = token?.value;
  
      if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
  
      const decoded = jwt.verify(userId, process.env.TOKEN_SECRET!) as JwtPayload;
      const userIdFromToken = decoded?.id;
  
      // Fetch income for a specific source
      const incomes = await incomeModel.find({
        userId: userIdFromToken,
        source,
      });
  
      if (incomes.length === 0) {
        return NextResponse.json({
          success: false,
          message: `No incomes found for source: ${source}`,
        }, { status: 404 });
      }
  
      return NextResponse.json({
        success: true,
        incomes,
      });
    } /* eslint-disable */catch (error: any) /* eslint-disable */{
      console.log("Unexpected error occurred in fetching incomes by source:", error);
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
  