import { NextResponse } from "next/server";
import { dbConnect } from "../../../../helpers/connectDB";
dbConnect()
export async function GET() {
    return NextResponse.json({
        message:"Hello World"
    })
    
}