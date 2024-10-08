"use client"
import Link from 'next/link'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import Image from 'next/image';
import cartProducts from '../context/context';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Hamburger from 'hamburger-react'



const Navbar = () => {
  const session = useSession();
  const { cartItems, setCartItems } = useContext(cartProducts)
  const [dropdown2, setdropdown2] = useState(false)
  const [dropdown, setdropdown] = useState(false)
  const [email, setemail] = useState("")
  // const [profile, setprofile] = useState("")
  const {profile,setprofile} = useContext(cartProducts)
  const [session1, setsession1] = useState()
  const [isOpen, setOpen] = useState(false)
  // const [imgsrc, setimgsrc] = useState(session?.data?.user?.image)
  const path = usePathname()
  const router = useRouter()
  const drop = useRef()
  const hamburgerMenu = useRef()

  const handleblur = (e) => {
    const currentTarget = e.currentTarget;
    const elementClicked = e.relatedTarget;
    const parentElement = e.currentTarget; // The element where onBlur occurred
    if (!parentElement.contains(elementClicked)) {
      setdropdown(false)
  
    }


  };
  const handleblur1 = (e) => {
    const currentTarget = e.currentTarget;

    // Give browser time to focus the next elemen

    if (
      hamburgerMenu.current &&
      !hamburgerMenu.current.contains(e.relatedTarget)
    ) {
      setOpen(false);
    }


  };

  const searchAction = async (e) => {
    const search = e.get("search-dropdown")
    if (search === "") {
      router.push(`/`)
    } else {
      router.push(`/products?search=${search}`)
    }
  }

  useEffect(() => {
    const fetchCart = async () => {
      const session = await getSession()
      const email = session?.user?.email
      const user = await fetch("/api/user/", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ oldEmail: email })
      })
      const json = await user.json()
      setprofile(json.profileImg)
      setemail(json.email)

      const promises = json?.cart?.map(async (id) => {
        const res = await fetch(`/api/product?id=${id}`)
        const cart = await res.json()
        // setCartItems([...cartItems,cart.products[0]])
        return cart.products[0]
      })
      if (promises) {
        const result = await Promise.all(promises)
        const cart = result.filter((item)=>{
          return item !== undefined
        })
        setCartItems(cart)
      }
      // setCartItems(cart,"hiii")
    }
    fetchCart()
  }, [session,router])

  useEffect(() => {
    const sess = async () => {
      const sessdata = await getSession()
      setsession1(sessdata)
    }
    sess()
  }, [router, session])


  return (
    <header className='text-xl bg-slate-300 sticky top-0 z-50'>
      <nav className='flex justify-between lg:justify-around items-center h-16  md:px-10 px-3  relative'>
        <Link className="logo font-bold  text-nowrap text-violet-950" href={"/"}>
          V-shop
        </Link>
        <form className="md:block hidden" action={searchAction}>
          <div className="flex w-96">
            <div className="relative w-full ">
              <input type="search" name='search-dropdown' id="search-dropdown" className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border-s-gray-50 border-s-2 border border-gray-300 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="search products" />
              <button type="submit" className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700">
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
                <span className="sr-only">Search</span>
              </button>
            </div>
          </div>
        </form>

        {/* hidden lg: */}
        <div ref={hamburgerMenu} className={`nav ${!isOpen&&"hidden"} lg:flex transition-transform w-full lg:w-auto bg-slate-300 lg:bg-transparent absolute left-0 top-24 md:top-16 lg:static flex justify-center items-center py-5 lg:py-0 shadow-md lg:shadow-none`}>

          <ul className='flex flex-col lg:flex-row gap-4 lg:gap-10 h-full w-full justify-between items-center bg font-bold'>
            <li onClick={()=>setOpen(false)} className={`hover:-translate-y-[2px] text-violet-900 hover:text-rose-700 ${path === "/" && "text-rose-700"} transition-transform `}><Link href={"/"}>Home</Link></li>
            <li onClick={()=>setOpen(false)} className={`hover:-translate-y-[2px] text-violet-900 hover:text-rose-700 ${path === "/about" && "text-rose-700"} transition-transform `}><Link href={"/about"}>About</Link></li>
            <li onClick={()=>setOpen(false)} className={`hover:-translate-y-[2px] text-violet-900 hover:text-rose-700 ${path === "/products" && "text-rose-700"} transition-transform`}><Link href={"/products"}>Products</Link></li>
          </ul>
        </div>


        <div className="procart  flex md:gap-5 gap-1 justify-end items-center text-end">

          <div className='relative text-4xl hover:scale-105 hover:text-gray-600 mx-3'><Link href={"/cart"}><MdOutlineShoppingCart /></Link>
          {cartItems.length > 0 &&<div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">{cartItems.length}</div>}
          </div>

          {session1 ?
            <div tabIndex={0} ref={drop} onBlur={(e) => handleblur(e)} onClick={() => setdropdown(!dropdown)} className="relative w-14 cursor-pointer profile flex  gap-1 justify-start  items-center text-end bg-slate-900 rounded-full shadow-xl">

              <div id="dropdownUserAvatarButton" data-dropdown-toggle="dropdownAvatar" className="flex shrink-0 text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" type="button" >
                <span className="sr-only">Open user menu</span>
                <Image className="w-8 h-8 rounded-full object-cover" src={profile || session?.data?.user?.image || "/images/user.png"} alt="user photo" height={100} width={100} />
              </div>
              <span className='text-white select'><IoIosArrowDown /></span>

              <div id="dropdownAvatar" className={`z-50 ${!dropdown && "hidden"} absolute top-10 -right-10 md:-right-20 text-center bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600`}>
                <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  <div>{session?.data?.user?.name}</div>
                  <div className="font-medium truncate">{email || ""}</div>
                </div>
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUserAvatarButton">
                  <li>
                    <Link href={`/profile`} onClick={() => setdropdown(false)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Profile</Link>
                  </li>
                  
                </ul>
                <div className="py-2">
                  <button onClick={signOut} className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</button>
                </div>
              </div>
            </div>
            :

            <div className="login">
              <Link href={"/login"}>Login</Link>
            </div>}
          <span onBlur={handleblur1} className='lg:hidden'>
            <Hamburger toggled={isOpen} toggle={setOpen} />
          </span>
        </div>
      </nav>
      <form className="md:hidden" action={searchAction}>
        <div className="flex w-full ">
          <div className="relative w-full">
            <input type="search" id="search-dropdown1" name='search-dropdown' className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border-s-gray-50 border-s-2 border border-gray-300 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="search products" required />
            <button type="submit" className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700">
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </div>
        </div>
      </form>


    </header>
  )
}

export default Navbar

