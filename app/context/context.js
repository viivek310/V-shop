"use client"
import { createContext, useContext, useState } from "react";

export const cartProducts = createContext();

export function CartWrapper({ children }) { 
    const [cartItems, setCartItems] = useState([]);
    const [isAdmin, setisAdmin] = useState(false)
    const [products, setproducts] = useState([])
    const [user, setUser] = useState(null)
    const [profile, setprofile] = useState("")
   
    return (
        <cartProducts.Provider value={{ cartItems,setCartItems,isAdmin,setisAdmin,products,setproducts,user,setUser,profile,setprofile}}>
            {children}
        </cartProducts.Provider>
    );
}

export default cartProducts; 