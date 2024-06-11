import React, { useContext } from 'react'
import Image from 'next/image'
import { MdOutlineShoppingCart } from "react-icons/md";
import cartProducts from '../context/context';
import { useRouter } from 'next/navigation';

const ProductPage = ({ product }) => {
  const router = useRouter()

 

  const changeRouter = ()=>{
    router.push(`/products/${product.productID}`)
  }

  return (
    <div onClick={changeRouter} className="product cursor-pointer h-52 w-3/4 flex bg-slate-50 hover:shadow-2xl hover:scale-[1.01] transition-transform rounded-lg overflow-hidden ">
      <div className="img w-[20%] h-full overflow-hidden">
        <Image className='h-full w-full hover:scale-110 object-cover transition-transform' src={product.images[0]} height={100000} width={100000} alt='smartphone'></Image>
      </div>
      <div className="des space-y-4 p-10 px-10 w-[60%] flex flex-col ">
        <h2 className="product_name text-lg font-bold">
          {product.productName}
        </h2>
        <div className="product_des  line-clamp-2 space-x-5  overflow-clip">
          {/* {product.ProductDes} */}
          {product?.ProductDes?.slice(0,3).map((des,indx)=>{
            return <span key={indx}>
                {des}
            </span>
          })}
        </div>
        {/* <div className="button">
          <button onClick={handleclick} className='bg-purple-600 text-white p-2 rounded-full font-bold flex justify-center items-center gap-3'><span><MdOutlineShoppingCart /></span>Add to cart</button>
        </div> */}

      </div>
      <div className="product_price flex justify-center items-center  flex-col py-10 bg-blue-100 w-[22%]">
        <h3 className='text-xl font-bold'>₹{product.productDisPrice}</h3>
        <div className="discount">
          <span className='line-through text-gray-700 text-xs mx-2'>₹{product.productPrice}</span>
          <span className='text-green-500 text-sm'>{product.productDiscount}% off</span>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
