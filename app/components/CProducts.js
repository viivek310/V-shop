import React from 'react'
import Image from 'next/image'

const CProducts = ({data}) => {
    return (
        <div className=" product relative size-40">
            <div className=" w-full h-3/4">
                <Image className="object-cover w-full h-full rounded-md " src={data.images[0]} alt="This is image" width={1000} height={1000} sizes='100%'/>
            </div>
            <h5 className="text-center line-clamp-2">{data.productName}</h5>
        </div>
    )
}

export default CProducts
