import User from "@/models/user";
import connectDB from "@/connection";
import { NextResponse } from "next/server";


export async function POST(request){
    const data = await request.json()
    connectDB()
    const result = await User.updateOne(
        {oldEmail: data.oldEmail},
        { $pull: { cart: data.productID } }
      );
    return NextResponse.json({success: true})
}