import connectDB from "@/connection";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request) {
  const data = await request.json()
  const user = await User.findOne({ oldEmail: data.oldEmail })
  //  console.log()
  // const cartArray = [...user.cart,data.productID]
  // const unique = [...new Set(cartArray)]
  // console.log(unique,cartArray)
  if (user?.cart?.includes(data.productID)) {
    return NextResponse.json({ error: "This product is already in cart" , success: false})
  } else {
    const result = await User.updateOne(
      { oldEmail: data.oldEmail },
      { $push: { cart: data.productID } }
    );
    console.log(result)
  }


  return NextResponse.json({ success: true })
}