"use client"
import React, { useContext, useEffect, useState } from 'react'
import cartProducts from '../context/context';
import { MdDeleteOutline } from "react-icons/md";
import Image from 'next/image';
import { getSession } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import formatToINR from '../util';


const Page = () => {
    const { cartItems, setCartItems } = useContext(cartProducts);
    const [counts, setCounts] = useState(cartItems?.map(() => 1));
    const [total, settotal] = useState(0)
    const router = useRouter()
    const { session, data, status } = useSession()
    const [session1, setsession1] = useState()

    useEffect(() => {
        const fetchsession = async () => {
            const sessiondata = await getSession()
            setsession1(sessiondata)
            if (!sessiondata) {
                router.push("/login")
            }
        }
        fetchsession()
    }, [session, status])


    useEffect(() => {
        // Populate counts array with initial counts from cartItems
        setCounts(cartItems?.map(() => 1));
    }, [cartItems]);
    useEffect(() => {
        // const  newItems = cartItems.filter((item)=>{
        //     return item !== undefined
        // })
        // setCartItems(newItems)
        settotal(cartItems.reduce((total, item, ind) => total + item?.productDisPrice * counts[ind], 0))
    }, [cartItems, counts])

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

    const deleteCart = async (id) => {
        const session = await getSession()
        const email = session?.user?.email
        const res = await fetch("/api/user/removeCart", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productID: id, oldEmail: email })
        })
        if (res.ok) {
            const newCart = cartItems.filter((itm) => {
                return itm.productID !== id
            })
            setCartItems(newCart)
        }
    }

    return (
        <>
            <div className='sm:py-5 sm:p-5 md:px-10 min-h-[80svh] flex flex-col lg:flex-row gap-2 sm:gap-5 md:gap-10 pb-28'>
                {session1 && <>
                    <div className='cartitems bg-neutral-300 w-full lg:w-[80%] rounded-md drop-shadow-xl h-fit p-1 sm:p-5 space-y-5'>
                        {cartItems?.length > 0 ? cartItems.map((item, ind) => {

                            return <div key={ind}>
                               {item&& <div  className='flex  h-52 w-full'>
                                    <div className="img h-52 w-[30%] md:w-[20%] rounded-md overflow-hidden shrink-0">
                                        <Image className='h-full w-full object-cover ' src={item?.images[0] || ""} width={1000} height={1000} alt='product image' />
                                    </div>
                                    <div className='flex flex-col sm:flex-row w-[70%] justify-between md:w-[80%]'>
                                        <div className='productdes px-2 sm:px-5 md:px-10 sm:w-[70%] space-y-3'>
                                            <h2 className='text-lg md:text-xl sm:py-3'>{item?.productName}</h2>
                                            <div className="product_des line-clamp-4 sm:line-clamp-2 md:line-clamp-none space-x-5  overflow-clip">
                                                <ul className='list-inside list-disc text-xs sm:text-sm md:text-base'>
                                                    {item?.ProductDes.slice(0, 3).map((des, indx) => {
                                                        return <li key={indx}>
                                                            {des}
                                                        </li>
                                                    })}
                                                </ul>
                                            </div>

                                        </div>
                                        <div className='sm:w-[30%] flex justify-around sm:justify-center items-center flex-col'>
                                            <div className='flex gap-2 sm:block items-center sm:items-start'>
                                                <h3 className='md:text-xl font-bold'>₹{formatToINR(item?.productDisPrice)}</h3>
                                                <div className="discount">
                                                    <span className='text-green-500 text-sm'>{item?.productDiscount}% off</span>
                                                    <span className='line-through text-gray-700 text-xs mx-2'>₹{formatToINR(item?.productPrice)}</span>
                                                </div>
                                            </div>
                                            <div className='flex gap-2 md:gap-0 md:flex-col items-center'>
                                                <form className="max-w-xs sm:mx-auto my-2 w-20 sm:w-32">
                                                    <div className="relative flex items-center max-w-[11rem] ">
                                                        <button onClick={() => decItem(ind)} type="button" id="decrement-button" data-input-counter-decrement="bedrooms-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-1 sm:p-2 md:p-3 h-11  ">
                                                            <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                                                            </svg>
                                                        </button>
                                                        <input type="text" id="bedrooms-input" readOnly data-input-counter data-input-counter-min="1" data-input-counter-max="5" aria-describedby="helper-text-explanation" className="bg-gray-50 border-x-0 border-gray-300 h-11 font-medium text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full lg:pb-6 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" value={counts[ind] || ""} required />
                                                        <div className="absolute bottom-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2  hidden md:flex items-center text-xs text-gray-400 space-x-1 rtl:space-x-reverse ">
                                                            <span>Items</span>
                                                        </div>
                                                        <button onClick={() => incItem(ind)} type="button" id="increment-button" data-input-counter-increment="bedrooms-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-1 sm:p-2 md:p-3 h-11 ">
                                                            <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </form>
                                                <div>
                                                    <button onClick={() => deleteCart(item?.productID)} className='bg-red-500 px-3 py-1 rounded-full  flex items-center'><span className='md:text-xl'><MdDeleteOutline /> </span><span className='hidden sm:inline'>remove</span></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>}
                            </div>
                        }) : <div className='text-center p-5'>No items in cart. Add some items to cart</div>}
                    </div>
                    <div className='bg-neutral-300 rounded-md drop-shadow-xl w-full sm:w-1/2 md:w-[20%] h-fit p-5'>
                        <h3>Total Amount</h3>
                        <span>₹{formatToINR(total)}</span>
                    </div></>}
            </div>
        </>
    )
}

export default Page
