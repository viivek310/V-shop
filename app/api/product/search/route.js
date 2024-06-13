import Product from "@/models/products";
import connectDB from "@/connection";
import { NextResponse } from "next/server";

export async function POST(request){
    const req = await request.json()
    const search = req.search
    const limit = 10;
    const url = new URL(request.url); 
    const page = parseInt(url.searchParams.get('page')) || 1;   
    const startIndex = (page - 1) * limit;
    connectDB()
    const product = await Product.find({productName: { $regex: search, $options: 'i' }}).sort({ createdAt: -1 }).skip(startIndex).limit(limit)
    const categories = await Product.distinct('category');
    let pages =Math.ceil(product.length/limit)
    return NextResponse.json({product,categories})
}