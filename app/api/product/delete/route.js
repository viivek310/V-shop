import connectDB from "@/connection";
import Product from "@/models/products";
import { NextResponse } from "next/server";

export async function POST(request){
    const productID = await request.json()
    connectDB()
    const del = await Product.deleteOne({productID: productID.id})
    return NextResponse.json({success: true})
}