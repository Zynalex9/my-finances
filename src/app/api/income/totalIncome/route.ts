import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../../helpers/connectDB";
import incomeModel from "../../../../../models/incomeModel.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongodb"; // Import ObjectId from mongodb

// Connect to the database
dbConnect();

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token");
    const userId = token?.value;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(userId, process.env.TOKEN_SECRET!) as JwtPayload;
    const userIdFromToken = decoded?.id;

    const userObjectId = new ObjectId(userIdFromToken);

    const totalIncome = await incomeModel.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$amount" },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      totalIncome: totalIncome[0]?.totalIncome || 0,
    });
  } catch (error: any) {
    console.log("Unexpected error occurred in fetching total income:", error);

    // Handle any unexpected errors
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
