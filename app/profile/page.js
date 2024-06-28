"use client"
import Image from 'next/image'
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { getSession, useSession } from 'next-auth/react'
import { FiEdit2 } from "react-icons/fi";
import { updateUser } from '../actions/server';
import { useRouter } from 'next/navigation';
import cartProducts from '../context/context';
import { useContext } from 'react';
import axios from 'axios';
import { json } from 'react-router-dom';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Page = () => {
  const { data, status } = useSession()
  const session = useSession()
  const { isAdmin, setisAdmin } = useContext(cartProducts)
  // const [user, setUser] = useState({ name: null, username: null, email: null })
  const { user,setUser } = useContext(cartProducts)
  const [editClicked, seteditClicked] = useState(false)
  const ref = useRef(null)
  const router = useRouter();
  const [change, setchange] = useState([])
  // const [profile, setprofile] = useState("")
  const {profile,setprofile} = useContext(cartProducts)
  const [loading, setloading] = useState(false)
  // console.log(session.data)
  const [session1, setsession1] = useState()
  const oldEmail = { oldEmail: session1?.user?.email }
  useEffect(() => {
    const fetchuser = async () => {
      const user = await fetch("/api/user/", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(oldEmail)
      })
      // console.log(user)
      const res = await user.json()
      setprofile(res.profileImg)
      setUser({ name: res.name, username: res.username, email: res.email })
      setisAdmin(res.isAdmin)
    }
    fetchuser()
  }, [session1, router])


  useEffect(() => {
    const fetchsession = async () => {
      const sessiondata = await getSession()
      setsession1(sessiondata)
      if (!sessiondata) {
        router.push("/login")
      }
    }
    fetchsession()
  }, [session])

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
    setchange([...change, e.target.name])
  };


  const handleSubmit = async (e) => {
    setloading(true)
    const arr = Array.from([...new Set(change)])
    const res = await updateUser(e, { "changes": arr });
    if (res.success) {
      toast.success('Profile updated', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        });
    }
    seteditClicked(false);
  };

  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <div className='container w-[100vw] m-auto h-[85svh] flex justify-center items-center'>
        {session1 && <div className="profile relative">
          <div className="image w-24 h-24 rounded-full overflow-hidden container mx-auto">
            <Image className='w-full h-full object-cover  ' src={profile || session?.data?.user?.image || "/images/user.png"} height={100} width={100} priority alt='user image' />

          </div>
          <form className='w-[70vw] sm:w-[40vw] lg:w-[20vw]' ref={ref} action={(e) => { handleSubmit(e) }}>
            {/* <div className="relative z-0 mt-10">
            <input disabled={!editClicked} type="text" id="name" name="name" value={user.name || ""} onChange={(e) => handleChange(e)} className="block w-full px-0 py-2 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:text-gray-900 focus:outline-none focus:ring-0 focus:text-gray-900 peer" placeholder=" " />
            <label htmlFor="small_standard" className="absolute text-sm text-gray-700 dark:text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-gray-900 peer-focus:dark:text-gray-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Name</label>
            </div> */}
            {editClicked && <div className="imgages my-3">

              <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="file_input">Change Profile</label>
              <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" name='profileImg' id="file_input" type="file" accept="image/*" />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-800" id="file_input_help">SVG, PNG, JPG or GIF (Max file size - 5mb)</p>
            </div>}
            <input type="hidden" name="oldEmail" value={session?.data?.user?.email || ""} />
            <div className="relative z-0 mt-10">
              <input disabled={!editClicked} type="email" id="email" name="email" value={user.email || ""} onChange={(e) => handleChange(e)} className="block w-full px-0 py-2 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-gray-900 focus:outline-none focus:ring-0 focus:border-gray-900 peer" placeholder=" " />
              <label htmlFor="small_standard" className="absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-gray-900 peer-focus:dark:text-gray-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Email</label>
            </div>
            <div className="relative z-0 mt-10">
              <input disabled={!editClicked} type="text" id="username" name="username" value={user.username || ""} onChange={(e) => handleChange(e)} className="block w-full px-0 py-2 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-gray-900 focus:outline-none focus:ring-0 focus:border-gray-900 peer" placeholder=" " />
              <label htmlFor="small_standard" className="absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-gray-900 peer-focus:dark:text-gray-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">username</label>
            </div>

            <button disabled={!editClicked} className={`${!editClicked && "invisible"} p-3 bg-blue-300 my-5 container mx-auto rounded-full hover:bg-blue-400 `}>Save</button>
          </form>
          <div onClick={() => seteditClicked(!editClicked)} className={`edit text-3xl md:text-xl absolute text-white top-0 -right-10 ${editClicked ? "bg-gray-500" : "bg-black"} p-2 rounded-full`}>
            <FiEdit2 />
          </div>
        </div>}
      </div>
    </>
  )
}

export default Page
