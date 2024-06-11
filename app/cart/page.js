"use client"
import React, { useContext, useEffect, useState } from 'react'
import cartProducts from '../context/context';
import { MdDeleteOutline } from "react-icons/md";
import Image from 'next/image';
import { getSession } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


const Page = () => {
    const { cartItems, setCartItems } = useContext(cartProducts);
    const [counts, setCounts] = useState(cartItems?.map(() => 1));
    const [total, settotal] = useState(0)
    const router = useRouter()
    const {session,data,status} = useSession()

    useEffect(() => {
        if(status==="unauthenticated"){
            router.push("/login")
        }
    }, [session,status])
    

    useEffect(() => {
        // Populate counts array with initial counts from cartItems
        setCounts(cartItems?.map(() => 1));
    }, [cartItems]);
    useEffect(() => {
        
        settotal(cartItems.reduce((total,item,ind)=>total+item.productDisPrice * counts[ind],0))
    }, [cartItems,counts])
    
    // Function to increment count for a specific item
    const incItem = (index) => {
        setCounts(prevCounts => {
            const newCounts = [...prevCounts];
            if (newCounts[index] < cartItems[index].quantity) {
                newCounts[index] += 1;
            }
            return newCounts;
        });
    };

    // Function to decrement count for a specific item
    const decItem = (index) => {
        setCounts(prevCounts => {
            const newCounts = [...prevCounts];
            if (newCounts[index] > 1) {
                newCounts[index] -= 1;
            }
            return newCounts;
        });
    };

    const deleteCart = async (id)=>{
        const session = await getSession()
            const email = session?.user?.email
        const res = await fetch("/api/user/removeCart",{method: "POST",
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({productID: id,oldEmail: email})
        })
        if(res.ok){
            const newCart = cartItems.filter((itm)=>{
                return itm.productID!==id
            })
            setCartItems(newCart)
        }
    }
    
    return (
        <div className='p-5 px-10 min-h-[80svh] flex gap-10 pb-28'>
            <div className='cartitems bg-neutral-300 w-[80%] rounded-md drop-shadow-xl h-fit p-5 space-y-5'>
                {cartItems?.length > 0 ? cartItems.map((item, ind) => {
                    
                    return <div key={ind} className='flex  h-52 w-full'>
                        <div className="img h-52 w-[20%] rounded-md overflow-hidden shrink-0">
                            <Image className='h-full w-full object-cover' src={item.images[0] || ""} width={1000} height={1000} alt='product image' />
                        </div>
                        <div className='productdes px-10 w-[60%] space-y-3'>
                            <h2 className='text-xl py-3'>{item.productName}</h2>
                            <div className='flex gap-x-5 truncate text-wrap  flex-wrap '>
                                {item.ProductDes.slice(0, 2).map((des,index) => {
                                    return <span key={index}>
                                        {des}
                                    </span>
                                })}
                            </div>
                        </div>
                        <div className='w-[20%] flex justify-center items-center flex-col'>
                            <h3 className='text-xl font-bold'>₹{item.productDisPrice}</h3>
                            <div className="discount">
                                <span className='line-through text-gray-700 text-xs mx-2'>₹{item.productPrice}</span>
                                <span className='text-green-500 text-sm'>{item.productDiscount}% off</span>
                            </div>
                            <form className="max-w-xs mx-auto my-2">
                                <div className="relative flex items-center max-w-[11rem]">
                                    <button onClick={()=>decItem(ind)} type="button" id="decrement-button" data-input-counter-decrement="bedrooms-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11  ">
                                        <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                                        </svg>
                                    </button>
                                    <input type="text" id="bedrooms-input" readOnly data-input-counter data-input-counter-min="1" data-input-counter-max="5" aria-describedby="helper-text-explanation" className="bg-gray-50 border-x-0 border-gray-300 h-11 font-medium text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full pb-6 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" value={counts[ind]||""} required />
                                    <div className="absolute bottom-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex items-center text-xs text-gray-400 space-x-1 rtl:space-x-reverse">
                                        <span>Items</span>
                                    </div>
                                    <button onClick={()=>incItem(ind)} type="button" id="increment-button" data-input-counter-increment="bedrooms-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 ">
                                        <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                            <div>
                                <button onClick={()=>deleteCart(item.productID)} className='bg-red-500 px-3 py-1 rounded-full  flex items-center'><span className='text-xl'><MdDeleteOutline /> </span>remove</button>
                            </div>
                        </div>
                    </div>
                }) : <div className='text-center p-5'>No items in cart. Add some items to cart</div>}
            </div>
            <div className='bg-neutral-300 rounded-md drop-shadow-xl w-[20%] h-fit'>
                <h3>Total Amount</h3>
                <span>₹{total}</span>
            </div>
        </div>
    )
}

export default Page
