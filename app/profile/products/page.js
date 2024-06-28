"use client"
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import { getSession, useSession } from 'next-auth/react';
import { addProduct } from '@/app/actions/server';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useContext } from 'react';
import cartProducts from '@/app/context/context';
import { useRouter } from 'next/navigation';
import ProductPage from '@/app/components/ProductPage';
import AdminProduct from '@/app/components/AdminProduct'
import { url } from '@/app/Cloudinary/cloudinary';



const Products = () => {
  const ref = useRef(null)
  const [isAdmin, setisAdmin] = useState(false)
  const [Add, setAdd] = useState(false)
  const {products, setproducts} = useContext(cartProducts)
  const [session1, setsession1] = useState()
  const [currentpage, setcurrentpage] = useState(1)
  const [pages, setpages] = useState(0)
  const router = useRouter()
  const {query} = router
  const [category, setcategory] = useState()
  const [search, setsearch] = useState()

  const { session, data, status } = useSession()
  const [isVisible, setIsVisible] = useState(false);


  useEffect(() => {
    const fetchsession = async()=>{
      const sessiondata = await getSession()
      setsession1(sessiondata)
      if(!sessiondata){
        router.push("/login")
      }
    }
    fetchsession()
  }, [session])
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

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
  }, [router]);


  useEffect(() => {
    const fetchproducts = async () => {
      const ftch = await fetch(`/api/product?page=${currentpage}&category=${category && category}`)
      const res = await ftch.json()
      setproducts(res.products)
      setpages(res.pages)
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    fetchproducts()
  }, [currentpage, router])



  const incCP = () => {
    setcurrentpage((cp) => {
      if (cp < pages) {
        return cp + 1;
      } else {
        return cp;
      }
    })
  }

  const decCP = () => {
    setcurrentpage((cp) => {
      if (cp > 1) {
        return cp - 1;
      } else {
        return cp;
      }
    })
  }

  const handleServer = async (e) => {
    const res = await addProduct(e);
    if (res?.error) {
      toast.error(`${res.error}`, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",

      });
    } else {
      ref.current?.reset()
      toast.success('New Product Added', {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }
  return (
    <div className='min-h-[100svh]'>
      {isAdmin && <div className='AddProduct w-screen   min-h-[85svh] flex flex-col justify-center items-center py-5'>
        <ToastContainer
          position="bottom-center"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />

        <div className="buttons">
          <button onClick={() => setAdd(true)} className='rounded-lg bg-red-600 text-white border border-black p-1 m-2'>
            Add new product
          </button>
          <button onClick={() => setAdd(false)} className='rounded-lg bg-red-600 text-white border border-black p-1 m-2'>
            view All products
          </button>
        </div>
        {Add ?
          <div className="relative">
            <h2 className='text-xl font-bold text-center'>Add new Product</h2>
            <form ref={ref} action={(e) => handleServer(e)}>
              <div className="relative z-0 mt-10">
                {/* <input type='hidden' name='oldEmail' value={session?.data?user?.email}/> */}
                <input type="hidden" name='oldEmail' value={session1?.user?.email||''}/>
                <input required type="text" id="productID" name="productID" className="block w-full px-0 py-2 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:text-gray-900 focus:outline-none focus:ring-0 focus:text-gray-900 peer" placeholder=" " />
                <label htmlFor="small_standard" className="absolute text-sm text-gray-700 dark:text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-gray-900 peer-focus:dark:text-gray-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Product ID</label>
              </div>
              <div className="relative z-0 mt-10">
                <input required type="text" id="productName" name="productName" className="block w-full px-0 py-2 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:text-gray-900 focus:outline-none focus:ring-0 focus:text-gray-900 peer" placeholder=" " />
                <label htmlFor="small_standard" className="absolute text-sm text-gray-700 dark:text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-gray-900 peer-focus:dark:text-gray-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Product Name</label>
              </div>
              <div className="relative z-0 mt-10">
                <input required type="number" id="productPrice" min={0} name="productPrice" className="block w-full px-0 py-2 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-gray-900 focus:outline-none focus:ring-0 focus:border-gray-900 peer" placeholder=" " />
                <label htmlFor="small_standard" className="absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-gray-900 peer-focus:dark:text-gray-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Product Price</label>
              </div>
              <div className="relative z-0 mt-10">
                <input required type="number" id="productDisPrice" min={0} name="productDisPrice" className="block w-full px-0 py-2 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-gray-900 focus:outline-none focus:ring-0 focus:border-gray-900 peer" placeholder=" " />
                <label htmlFor="small_standard" className="absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-gray-900 peer-focus:dark:text-gray-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Discounted Price</label>
              </div>
              <div className="relative z-0 mt-10">
                <input required type="number" id="productDiscount" min={0} name="productDiscount" className="block w-full px-0 py-2 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-gray-900 focus:outline-none focus:ring-0 focus:border-gray-900 peer" placeholder=" " />
                <label htmlFor="small_standard" className="absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-gray-900 peer-focus:dark:text-gray-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Discount percentage </label>
              </div>
              <div className="relative z-0 mt-10">
                <input required type="text" id="category" name="category" className="block w-full px-0 py-2 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-gray-900 focus:outline-none focus:ring-0 focus:border-gray-900 peer" placeholder=" " />
                <label htmlFor="small_standard" className="absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-gray-900 peer-focus:dark:text-gray-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Category </label>
              </div>
              <div className="relative z-0 mt-10">
                <input required type="text" id="brand" name="brand" className="block w-full px-0 py-2 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-gray-900 focus:outline-none focus:ring-0 focus:border-gray-900 peer" placeholder=" " />
                <label htmlFor="small_standard" className="absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-gray-900 peer-focus:dark:text-gray-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Brand</label>
              </div>
              <div className="relative z-0 mt-10">
                <input required type="number" id="quantity" min={0} name="quantity" className="block w-full px-0 py-2 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-gray-900 focus:outline-none focus:ring-0 focus:border-gray-900 peer" placeholder=" " />
                <label htmlFor="small_standard" className="absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-gray-900 peer-focus:dark:text-gray-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Quantity </label>
              </div>
              <div className="relative z-0 mt-10">
                <textarea id="productDes" name="productDes" className="block w-full px-0 py-2 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-gray-900 focus:outline-none focus:ring-0 focus:border-gray-900 peer" placeholder=" " />
                <label htmlFor="small_standard" className="absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-gray-900 peer-focus:dark:text-gray-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Product Description</label>
              </div>

              <div className="imgages my-3">

                <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="file_input">Upload file</label>
                <input required className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" name='images' id="file_input" type="file" accept="image/*" multiple />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-800" id="file_input_help">SVG, PNG, JPG or GIF (Max file size - 5mb)</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-800" id="file_input_help">Select 5 files</p>

              </div>

              <button className={` p-3 bg-blue-300 my-5 container mx-auto rounded-full hover:bg-blue-400 `}>Save</button>
            </form>

          </div>
          :

          <div>
            <h2 className='text-xl font-bold text-center my-3'>View all Products</h2>
            {products.length === 0 ? <div className='h-[100svh]'>NO products to show</div> : <>
              <section className='products flex flex-col  items-center  space-y-10 w-[100vw]'>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <table className="w-[90vw]  table-fixed  text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-2 md:px-16 py-3 md:block hidden">
                          <span className="sr-only">Image</span>
                        </th>
                        <th scope="col" className="px-6 py-3  max-w-60">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 ">
                          Qty
                        </th>
                        <th scope="col" className="px-6 py-3 ">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 ">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((item) => {
                        return <AdminProduct key={item.productID} product={item} />
                      })}


                    </tbody>
                  </table>
                </div>


                <ul className="flex items-center -space-x-px h-10 text-base" id='pagination'>
                  <li>
                    <button onClick={decCP} className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                      <span className="sr-only">Previous</span>
                      <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                      </svg>
                    </button>
                  </li>

                  {[...Array(pages)].map((i, index) => {
                    return <li key={index}>
                      <span onClick={() => setcurrentpage(index + 1)} className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ${currentpage === (index + 1) ? "dark:bg-gray-700" : "dark:bg-gray-800"}  dark:border-gray-700 ${currentpage === (index + 1) ? "dark:text-white" : "dark:text-gray-400"}  dark:hover:bg-gray-700 dark:hover:text-white`}>{index + 1}</span>
                    </li>
                  })}
                  <li>
                    <button onClick={incCP} className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                      <span className="sr-only">Next</span>
                      <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                      </svg>
                    </button>
                  </li>
                </ul>
                <div>
                  <button className='rounded-lg bg-purple-500 text-white p-1' onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Go to top</button>
                </div>
              </section>
            </>}

          </div>
        }
      </div>}
      {(!isAdmin && isVisible) && <div className='text-center text-xl'>You are not an Admin</div>}
    </div>
  )
}

export default Products
