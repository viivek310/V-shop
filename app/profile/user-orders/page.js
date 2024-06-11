"use client"
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useContext } from 'react'
import cartProducts from '@/app/context/context'

const UserOrders = () => {
  const session = useSession()
  const router = useRouter();
  const {isAdmin} = useContext(cartProducts)
  useEffect(() => {
    if(session?.status !== "authenticated"){
      router.push("login")
    }
  }, [router])
  return (
    <div>
      This is user orders
    </div>
  )
}

export default UserOrders
