"use client"
import React, { useContext, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { MdOutlineShoppingCart } from "react-icons/md";
import cartProducts from '../context/context';
import Link from 'next/link';
import ProductPage from '../components/ProductPage';
import { useSearchParams } from 'next/navigation';
import { FaArrowCircleLeft } from "react-icons/fa";
import { MdCancel } from "react-icons/md";





const Page = () => {
  const [currentpage, setcurrentpage] = useState(1)
  const [pages, setpages] = useState(0)
  const [categories, setcategories] = useState([])
  const [category, setcategory] = useState(null)
  const [search, setsearch] = useState("")
  const [products, setproducts] = useState([])
  const params = useSearchParams()
  const [categoryclicked, setcategoryclicked] = useState(false)
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const paginationRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    if (params.get("search") !== null) {
      const srch = params.get("search")
      setsearch(srch)
    } else {
      setsearch()
    }
  }, [params])

  useEffect(() => {
    const fetchproducts = async () => {
      const ftch = await fetch(`/api/product?page=${currentpage}${category ? `&category=${category}` : ''}`)
      const res = await ftch.json()
      setproducts(res.products)

      setpages(res.pages)
      setcategories(res.categories)
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (params.get("search") === null) {
      fetchproducts()
    }

  }, [currentpage, category])

  // useEffect(() => {
  //   const fetchproducts = async () => {
  //     const ftch = await fetch(`/api/product?page=${currentpage}${category ? `&category=${category}` : ''}`)
  //     const res = await ftch.json()
  //     setproducts(res.products)

  //     setpages(res.pages)
  //     setcategories(res.categories)
  //     window.scrollTo({ top: 0, behavior: 'smooth' });
  //   }
  //   if(params.get("search")===null){
  //     fetchproducts()
  //   }

  // }, [category ])


  useEffect(() => {

    // setsearch(srch)
    const fetchproducts = async () => {
      const srch = params.get("search")
      const res = await fetch('/api/product/search', {
        method: "POST",
        headers: {
          'Accept': 'applicatoin/json',
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ search: srch })
      })
      const data = await res.json()
      setproducts(data.product)
      setcategories(data.categories)
    }
    if (search) {
      fetchproducts()
    }
  }, [search])




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

  const setButton = (cat) => {
    setcategory(cat)
  }

  useEffect(() => {
    if (params.get('category') !== null) {
      const fun = async () => {
        const cat = params.get("category")
        setcategory(cat)
        const ftch = await fetch(`/api/product?page=${currentpage}&category=${cat}`)
        const res = await ftch.json()
        setproducts(res.products)
      }
      fun()
    }
  }, [params])

  // const handleTouchStart = (e) => {
  //    ("hello")
  //   setTouchStartX(e.targetTouches[0].clientX);
  // };

  // const handleTouchMove = (e) => {
  //   setTouchEndX(e.targetTouches[0].clientX);
  // };

  // const handleTouchEnd = () => {
  //   if (touchStartX - touchEndX > 50) {
  //     // Swipe left
  //     paginationRef.current.scrollLeft += 100; // Adjust the scroll distance as needed
  //   }

  //   if (touchStartX - touchEndX < -50) {
  //     // Swipe right
  //     paginationRef.current.scrollLeft -= 100; // Adjust the scroll distance as needed
  //   }
  // };


  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - paginationRef.current.offsetLeft);
    setScrollLeft(paginationRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - paginationRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Adjust the scroll speed as needed
    paginationRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setStartX(e.targetTouches[0].clientX - paginationRef.current.offsetLeft);
    setScrollLeft(paginationRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    const x = e.targetTouches[0].clientX - paginationRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Adjust the scroll speed as needed
    paginationRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className={`container ${!search && "md:grid gtc "} m-auto gap-5  sm:p-5 px-0`}>
      <div className=' md:hidden text-2xl pt-2 flex items-center fixed top-25 bg-slate-200 w-full'><span onClick={() => setcategoryclicked(true)} className='inline-block px-3 text-4xl'><FaArrowCircleLeft /></span>Categories</div>
      {/* hidden md:block */}
      {!search && <section className={`category fixed flex flex-col top-24 ${categoryclicked ? "left-0" : "-left-[100%]"}  md:sticky md:top-20 py-2  bg-slate-200 h-full md:h-[85vh]    `}>
        <div onClick={() => setcategoryclicked(false)} className='flex justify-end p-2 text-3xl md:hidden'><MdCancel /></div>
        <h3 className='text-lg text-center p-1'>Explore catergories</h3>
        <div onClick={() => setcategory(null)} className={`p-2 cursor-pointer ${category === null && "bg-purple-300"}`}>All categories</div>
        <ul >
          <div className='overflow-y-auto max-h-[70svh]'>
            {categories.map((cat, index) => (
              <li onClick={() => setButton(cat)} className={`border-y border-b-slate-400 px-3 py-2 cursor-pointer ${category === cat && "bg-purple-300"} hover:bg-purple-200`} key={index}>{cat}</li>
            ))}
          </div>

        </ul>
      </section>}

      <section className='products bg-slate-200  flex flex-col items-center py-14 md:py-10 space-y-2 min-h-[100vh] sm:space-y-10'>
        {products.length === 0 ? <div className=' min-h-[100vh]'>No products to show</div> : <>
          {products?.map((item) => (
            <ProductPage key={item.productID} product={item} />
          ))}



          <ul className="flex items-center -space-x-px h-10 text-base py-12 " id='pagination'>
            <li>
              <button onClick={decCP} className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                <span className="sr-only">Previous</span>
                <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                </svg>
              </button>
            </li>
            <span className='pagination scrollbar-hide flex max-w-[50vw] overflow-x-auto cursor-pointer' ref={paginationRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
             >


              {[...Array(pages)].map((i, index) => {
                return <li key={index}>
                  <span onClick={() => setcurrentpage(index + 1)} className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ${currentpage === (index + 1) ? "dark:bg-gray-700" : "dark:bg-gray-800"}  dark:border-gray-700 ${currentpage === (index + 1) ? "dark:text-white" : "dark:text-gray-400"}  dark:hover:bg-gray-700 dark:hover:text-white`}>{index + 1}</span>
                </li>
              })}
      
            </span>
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
        </>}

      </section>
    </div>
  )
}

export default Page
