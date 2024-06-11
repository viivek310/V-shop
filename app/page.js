"use client"

import Slideshow from "./components/Slideshow";
import Category from "./components/Category";
import Product from "./components/Product";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";





// let topdeals=[
//   {
//     img: "/images/products/product1.jpg",
//     des: "Redmi Note 13 5G",
//     price: "₹15000"
//   },
//   {
//     img: "/images/products/product2.jpg",
//     des: "TECNO POVA 6 PRO 5G ",
//     price: "₹15000"
//   },
//   {
//     img: "/images/products/product3.jpg",
//     des: "Redmi 12 5G",
//     price: "₹15000"
//   },
//   {
//     img: "/images/products/product4.jpg",
//     des: "iQOO Neo 7 5G",
//     price: "₹15000"
//   },
//   {
//     img: "/images/products/product5.jpg",
//     des: "Oneplus Nord CE 3 5G",
//     price: "₹15000"
//   },
//   {
//     img: "/images/products/product6.jpg",
//     des: "POCO M6 Pro 5G",
//     price: "₹15000"
//   },
// ]

export default function Home() {
  const [showCategory, setshowCategory] = useState({})
  const [catProducts, setcatProducts] = useState([])
  const [topdeals, settopdeals] = useState()
  // const session = useSession()
  useEffect(() => {
    const ftchCategory = async()=>{
      const ftch = await fetch('/api/product')
      const res = await ftch.json()
      const cat = res.categories.slice(0,3)
      const deals =  res.products.sort((a, b) => a.price - b.price) 
      const firstFive = deals.slice(0,4)
      // console.log(deals)
      settopdeals(firstFive)
      setshowCategory(cat)
    }
    ftchCategory()
  }, [])
  
  useEffect(() => {
    const promise = Array.from(showCategory).map(async (element,ind) => {
      const res = await fetch(`/api/product?category=${element}`)
      const data = await res.json()
      // setcatProducts([...catProducts,data.products])
      return data.products
    });
    const getData = async()=>{
      const finalData = await Promise.all(promise)
      setcatProducts(finalData)
    }
    getData()
  }, [showCategory])
  

  return (
    <>
      <Slideshow />
      <section className="New-Arrivals relative min-h-[80svh] p-10 bg-[url('/images/apple.jpg')] bg-cover bg-fixed bg-no-repeat bg-center bg bg-blend-darken before:absolute before:left-0 before:top-0 before:h-full before:w-full before:bg-slate-950 before:z-10 before:opacity-10"> 
      <h2 className="text-3xl font-bold relative z-20 text-center my-10">Top Deals</h2>
      <div className="deals flex justify-center items-center flex-wrap gap-5 h-full ">
        {topdeals?.map((i,ind)=>{
          return <Product key={ind} data={i}/>
        })}
        
      </div>

      </section>
      <section className="category   min-h-[100svh] flex flex-col gap-5 items-center justify-center py-12">
        <h2 className="text-3xl">Categories</h2>
        <div className="container w-[80%] mx-auto flex gap-5 flex-wrap  justify-center items-center">
          {catProducts.map((product,ind)=>{
            return <Category key={ind} Category={product[0].category} datas={product} />
          })}
          
          {/* <Category Category={"Electronic gadgets"} datas={electronics} />
          <Category Category={"Fashion"} datas={fashion} /> */}
        </div>
      </section>
    </>
  );
}
