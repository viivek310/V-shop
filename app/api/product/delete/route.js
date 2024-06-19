import connectDB from "@/connection";
import Product from "@/models/products";
import { NextResponse } from "next/server";
import cloudinary from "@/app/Cloudinary/cloudinary";

export async function POST(request) {
    const productID = await request.json()
    connectDB()
    const products = await Product.findOne({ productID: productID.id })
    await Promise.all(products.images.map(async (img) => {
        try {
            const urlParts = img.split('/');
            const fileName = urlParts.pop();
            const [publicId] = fileName.split('.');
            const result = await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    }))
    const del = await Product.deleteOne({productID: productID.id})
    return NextResponse.json({ success: true })
}