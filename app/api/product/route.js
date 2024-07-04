import connectDB from "@/connection";
import Product from "@/models/products";
import { NextResponse } from "next/server";


export async function GET(request) {
    connectDB()
    // let req = await request.json();
    // const user = await User.find(req)
    const limit = 10;
    const url = new URL(request.url); 
    const page = parseInt(url.searchParams.get('page')) || 1;
    const category = url.searchParams.get('category')
    const search = url.searchParams.get('search')
    const id = url.searchParams.get('id')
    const filter = {
        productID: id,
        productName: { $regex: search||"", $options: 'i' },
        category: category
    };
   
    const filteredQuery = Object.fromEntries(
        Object.entries(filter).filter(([_, value]) => value !== "undefined" && value !== '' && value !== null)
    );
    const startIndex = (page - 1) * limit;

    const products = await Product.find(filteredQuery).sort({ createdAt: -1 }).skip(startIndex).limit(limit).select({_id:0})

    const totalProducts = await Product.countDocuments();
    let pages =Math.ceil(totalProducts/limit)

    const categories = await Product.distinct('category');
    // console.log(products,pages,categories)

    return NextResponse.json({products,pages,categories})                                            
}

