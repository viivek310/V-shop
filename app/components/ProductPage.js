import React, { useContext } from 'react'
import Image from 'next/image'
import { MdOutlineShoppingCart } from "react-icons/md";
import cartProducts from '../context/context';
import { useRouter } from 'next/navigation';
import formatToINR from '../util';

const ProductPage = ({ product }) => {
  const router = useRouter()



  const changeRouter = () => {
    router.push(`/products/${product.productID}`)
  }

  return (
    <div onClick={changeRouter} className="product cursor-pointer h-52 w-full sm:w-[90%] md:w-3/4 flex bg-slate-50 hover:shadow-2xl hover:scale-[1.01] transition-transform rounded-lg overflow-hidden select">
      <div className="img w-[40%] sm:w-[20%] h-full overflow-hidden">
        <Image className='h-full w-full hover:scale-110 object-cover transition-transform' src={product.images[0]} height={100000} width={100000} alt='smartphone'></Image>
      </div>
      <div className='w-[80%] flex flex-col md:flex-row'>
        <div className="des space-y-4 p-5 px-5 h-[70%] md:h-auto md:w-[70%] flex flex-col ">
          <div>
            <div>{product.brand}</div>
            <h2 className="product_name text-base md:text-lg font-bold line-clamp-2">
              {product.productName}
            </h2>
          </div>

          <div className="product_des line-clamp-4 sm:line-clamp-2 md:line-clamp-none space-x-5  overflow-clip truncate">
            <ul className='list-inside list-disc text-xs md:text-base'>
              {product?.ProductDes?.slice(0, 4).map((des, indx) => {
                return <li key={indx}>
                  {des}
                </li>
              })}
            </ul>
          </div>
        </div>
        <div className="product_price flex justify-center items-center h-[30%] md:h-auto flex-row-reverse  md:flex-col  md:py-10  md:w-[30%]">
          <h3 className='text-base md:text-xl font-bold'>₹{formatToINR(product.productDisPrice)}</h3>
          <div className="discount">
            <span className='text-green-500 text-sm'>{product.productDiscount}% off</span>
            <span className='line-through text-gray-700 text-xs mx-2'>₹{formatToINR(product.productPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
