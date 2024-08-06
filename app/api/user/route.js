import connectDB from "@/connection";
import User from "@/models/user";
import { NextResponse } from "next/server";


export async function POST(request) {
    connectDB()
    let req = await request.json();

    if (Object.keys(req).length>=0&&req.oldEmail!==" "&&req.oldEmail!==null&&req.oldEmail!==undefined) {
        const user = await User.findOne(req).select({_id:0,password:0})
        if(user){
            return NextResponse.json(user)
        }else{
            
            return NextResponse.json({"error": "user not found"})
        }
        
    }else{
        return NextResponse.json({"error": "user not found"})
    }

}