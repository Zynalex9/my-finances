import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../../helpers/connectDB";
import budgetModel from "../../../../../models/budgetModel.model";
dbConnect();
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const queryParams = {
    category: searchParams.get("category")
  };
  const budgetCategory = await budgetModel.findOne({
    category: queryParams.category,
  });
  if (!budgetCategory) {
    return NextResponse.json(
      { success: false, message: `${ queryParams.category} category not found` },
      { status: 404 }
    );
  }
  return NextResponse.json(
    { success: true, message: `${ queryParams.category} category found`, budgetCategory },
    { status: 200 }
  );
}
