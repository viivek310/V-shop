import Product from "@/models/products";
import connectDB from "@/connection";
import { NextResponse } from "next/server";

export async function POST(request){
    const req = await request.json()
    const search = req.search
    connectDB()
    const product = await Product.find({productName: { $regex: search, $options: 'i' }})
    const categories = await Product.distinct('category');
    return NextResponse.json({product,categories})
}