"use client"
import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useContext } from 'react'
import cartProducts from '../context/context'
import { getSession } from 'next-auth/react'


const ProfileNav = () => {
  const path = usePathname()
  const { isAdmin,setisAdmin } = useContext(cartProducts)
  useEffect(() => {
    const fetchSession = async () => {
      const sdata = await getSession();
      const user = await fetch("/api/user/", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ oldEmail: sdata?.user?.email })
      })
      const admin = await user.json()
      setisAdmin(admin.isAdmin)
      window.scrollTo({ top: 0, behavior: 'smooth' });

    };

    fetchSession();
  }, [path])
  
  return (
    <>{isAdmin&&
      <div className='flex justify-center items-center w-full bg-blue-500 sticky top-24 lg:top-16 z-20'>
        <ul className='flex gap-2 sm:gap-10 text-base sm:text-lg py-5 text-white'>
          <li className={`${(path === '/profile') && "bg-red-600"} py-1 px-1 sm:px-2 rounded-lg `}><Link href={"/profile"}>profile</Link></li>
          <li className={`${(path === '/profile/products') && "bg-red-600"} py-1 px-1 sm:px-2 rounded-lg `}><Link href={"/profile/products"}>Products</Link></li>
          {/* <li className={`${(path === '/profile/users') && "bg-red-600"} py-1 px-1 sm:px-2 rounded-lg `}><Link href={"/profile/users"}>Users</Link></li> */}
          {/* <li className={`${(path === '/profile/user-orders') && "bg-red-600"} py-1 px-1 sm:px-2 rounded-lg `}><Link href={"/profile/user-orders"}>User Orders</Link></li> */}

          {/* <li>Products</li>
        <li>Users</li>
        <li>User Orders</li>  */}
        </ul>
      </div>}
    </>
  )
}

export default ProfileNav
