import React from 'react'
import CProducts from './CProducts'
import { useRouter } from 'next/navigation'

const Category = ({Category,datas}) => {
  const router = useRouter()
  const changeRoute = ()=>{
    router.push(`products?category=${Category}`)
  }
  return (
    <div onClick={changeRoute} className="cursor-pointer category w-96 h-fit bg-indigo-200 rounded-xl p-5">
        <h2 className="text-xl text-center mb-3 font-bold ">{Category}</h2>
        <div className="products flex flex-wrap justify-center items-center gap-5 ">
          {datas.map((i,index)=>{

            return <CProducts key={index} data={i}/>
          })}
        </div>
      </div>
  )
}

export default Category
