import { getServerSession } from 'next-auth'
import Link from 'next/link'
import React from 'react'


const Footer = () => {
    return (
        <footer className='bg-slate-300'>
            <div className=' grid place-items-center '>
                <div className='container   px-32 lg:px-52 py-10 grid md:grid-cols-4 grid-cols-1  gap-10 justify-items-center'>
                    <div className="f1">
                        <h3 className='font-bold'>Get to know us</h3>
                        <div className='hover:translate-x-2 transition-transform'><Link href={"/about"}>About us</Link></div>

                    </div>
                    <div className="f2">
                        <h3 className='font-bold'>Connect With Us</h3>
                        <div className='hover:translate-x-2 transition-transform'>Instagram</div>
                        <div className='hover:translate-x-2 transition-transform'>Twitter</div>
                        <div className='hover:translate-x-2 transition-transform'>Facebook</div>
                    </div>
                    {/* <div className="f3">
                        <h3 className='font-bold'>Track Your Orders</h3>
                        <div className='hover:translate-x-2 transition-transform'><Link href={"/orders"}>Orders</Link></div>
                    </div> */}
                    <div className="f4">
                        <h3 className='font-bold'>Explore Products</h3>
                        <div className='hover:translate-x-2 transition-transform' ><Link href={"/products"}>Products</Link></div>
                    </div>
                </div>
            </div>
            <div className='text-center h-20 font-bold text-2xl'>Developed by Vivek Vasant</div>
        </footer>
    )
}

export default Footer
