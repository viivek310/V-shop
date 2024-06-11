"use client"
import React, { useContext, useEffect, useState } from 'react'
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { MdOutlineShoppingCart } from "react-icons/md";
import { GiShoppingBag } from "react-icons/gi";
import Image from 'next/image'
import cartProducts from '@/app/context/context';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import formatToINR from '@/app/util';




const ProductInfo = ({ params }) => {
    const [images, setimages] = useState([])
    const [index, setindex] = useState(0)
    const [product, setproduct] = useState({})
    const [category, setcategory] = useState()
    const [suggestProduct, setsuggestProduct] = useState([])
    const { cartItems, setCartItems } = useContext(cartProducts);
    const router = useRouter()
    const {status} = useSession()

    useEffect(() => {
        document.title = `V-shop-${product && product.productName}`
    }, [product])


    useEffect(() => {
        const ftchImg = async () => {
            const res = await fetch(`/api/product?id=${params.productID}`)
            const data = await res.json()
            setproduct(data?.products[0])
            setcategory(data?.products[0]?.category)
            setimages(data?.products[0]?.images)
        }
        ftchImg()
    }, [])

    useEffect(() => {
        const ftchSuggest = async () => {
            const res = await fetch(`/api/product?category=${product.category}`)
            const data = await res.json()
            const sug = data.products.filter((itm) => {
                return itm.productID !== product.productID
            })
            setsuggestProduct(sug)
        }
        ftchSuggest()
    }, [product])

    const prevImg = () => {
        if (index === 0) {
            setindex(images.length - 1)
        } else {
            setindex(index - 1)
        }
    }

    const nextImg = () => {
        if (index === images.length - 1) {
            setindex(0)
        } else {
            setindex(index + 1)
        }
    }

    const handleclick = async () => {
        if (status==="authenticated") {
            let exist = false
            cartItems.forEach((itms) => {
                if (itms.productID === product.productID) {
                    exist = true
                }
            })
            if (exist) {
                toast.error('Item already in cart', {
                    position: "bottom-center",
                    autoClose: 2999,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } else {
                const session = await getSession()
                const email = session?.user?.email
                const updatecart = async () => {
                    const res = await fetch("/api/user/updateCart", {
                        method: "POST",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ productID: product.productID, oldEmail: email })
                    })

                    setCartItems([...cartItems, product])
                    return res.ok
                }
                if (updatecart()) {
                    toast.success('Item added to cart', {
                        position: "bottom-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Bounce,
                    });
                }
            }
        }else{
            toast.error('Log in to acces Cart', {
                position: "bottom-center",
                autoClose: 2999,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }

    const changeRouter = (id) => {
        router.push(`/products/${id}`)
    }

    return (
        <>
            {<ToastContainer
                position="bottom-center"
                autoClose={2999}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />}
            <div className='min-h-[100svh] md:px-10 lg::px-20 '>

                <div className="select page bg-gray-200  sm:px-20 md:px-36 py-5 pb-10 rounded-xl">
                    <div className="grid gap-4 w-[100%] justify-items-center">
                        <div className='w-[95%] md:w-[80%] relative h-[50svh] md:h-[70svh]'>
                            <div onClick={() => nextImg()} className='rightarrow absolute text-7xl right-5 top-[50%] translate-y-[-50%] cursor-pointer'><IoIosArrowDroprightCircle /></div>
                            <div onClick={() => prevImg()} className='leftarrow absolute text-7xl left-5 top-[50%] translate-y-[-50%] cursor-pointer '><IoIosArrowDropleftCircle /></div>
                            <Image className="select h-full max-w-full w-full  lg:object-contain rounded-lg" src={images[index] || ""} alt="product image" width={1000} height={1000} />
                        </div>
                        <div className="grid grid-cols-5 md:gap-4">
                            {images.map((img, ind) => {
                                return <div className='h-24 md:h-36' key={ind} onClick={() => setindex(ind)}>
                                    <Image className={`select max-w-full w-full h-full rounded-lg  ${ind === index && "border-blue-600 border-4"} `} src={img || ""} alt="product image" width={1000} height={1000} />
                                </div>
                            })}
                        </div>
                    </div>
                    <div className='py-5 md:py-10 px-5 font-bold text-xl md:text-2xl'>{product?.productName}</div>
                    <div className='px-5 text-xl md:text-2xl flex gap-2 md:gap-5'>
                        <span className='text-green-500'>{product?.productDiscount}% off</span>
                        <span className='line-through text-slate-500'>₹{formatToINR(product?.productPrice)}</span>
                        <span className='font-bold'>₹{formatToINR(product?.productDisPrice)}</span>
                    </div>
                    <div className='buttons flex md:gap-5 py-5 md:py-12 justify-center text-base md:text-xl'>
                        <button onClick={handleclick} className='bg-purple-600 hover:bg-purple-800 w-1/2 py-2 sm:py-4 text-white p-2 rounded-full font-bold flex justify-center items-center gap-3'><span><MdOutlineShoppingCart /></span>Add to cart</button>
                        <button className='bg-orange-600 hover:bg-orange-800 w-1/2 py-2 sm:py-4 text-white p-2 rounded-full font-bold flex justify-center items-center gap-3'><span><GiShoppingBag /></span>Buy Now</button>

                    </div>
                    <div className='px-5'>
                        <h3 className='font-bold text-xl md:text-2xl py-5'>Details</h3>
                        <ul className='list-disc list-inside text-base md:text-xl'>
                            <li>Brand: {product?.brand}</li>
                            {product?.ProductDes?.map((pro, ind) => {
                                return <li key={ind}>{pro}</li>
                            })}
                        </ul>
                    </div>
                    <div className='suggestion px-5 md:px-0'>
                        <h3 className='font-bold text-xl md:text-2xl py-5'>Products from the same category</h3>
                        <div className='flex flex-col justify-center items-center md:items-start md:justify-normal md:flex-row gap-5 flex-wrap'>
                            {suggestProduct.length == 0 ? <div>No Products to Show</div> : suggestProduct.map((sug, ind) => {
                                return <div key={ind} onClick={() => changeRouter(sug.productID)} className='w-48 h-64  shadow-lg rounded-lg overflow-hidden'>
                                    <div className="img w-full h-2/3">
                                        <Image className='w-full h-full object-cover' src={sug.images[0] || ""} height={1000} width={1000} alt='product image' />
                                    </div>
                                    <div className="productdes p-2 text-sm bg-violet-100 h-full">
                                        <h4 className=' truncate'>{sug.productName}</h4>
                                        <div className="price flex gap-2 py-2">
                                            <span className='font-bold'>{formatToINR(sug.productDisPrice)}</span>
                                            <span className='line-through'>{formatToINR(sug.productPrice)}</span>
                                            <span className='text-green-500'>{sug.productDiscount}% off</span>
                                        </div>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductInfo
