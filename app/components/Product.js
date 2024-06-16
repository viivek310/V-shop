import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'
import formatToINR from '../util'

const Product = ({ data }) => {
  const router = useRouter()
  const changeRoute = ()=>{
    router.push(`/products/${data.productID}`)
  }
  return (
    <div onClick={changeRoute} className="box cursor-pointer size-48 h-72 relative z-20 font-bold flex flex-col items-center border rounded-lg overflow-hidden bg-slate-200">
      <div className="img h-[80%] w-full">
        <Image className="h-[100%] w-[100%] object-cover" height={10000} width={10000} src={data.images[0]} alt='product-image'></Image>
      </div>
      <h3 className='line-clamp-1'>{data.productName}</h3>
      <span>₹{formatToINR(data.productPrice)}</span>
    </div>
  )
}

export default Product
