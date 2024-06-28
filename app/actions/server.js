"use server"
import connectDB from "@/connection"
import User from "@/models/user"
import Product from "@/models/products"
import cloudinary from "../Cloudinary/cloudinary"
import bcrypt from "bcrypt"

export const updateUser = async (e, c) => {
    // const name = e.get("name")
    const username = e.get("username")
    const email = e.get("email")
    const oldEmail = e.get("oldEmail")
    const profile = e.get("profileImg")
    // console.log(profile)
    let profileImg
    if (profile.size >= 5 * 1024 * 1024) {
        return { error: "The file should be less than 5 mb" }
    }
    if (profile) {
        // console.log("hello")
        connectDB()
        try {
            const user = await User.findOne({ oldEmail })
            const urlParts = user.profileImg.split('/');
            const fileName = urlParts.pop();
            const [publicId] = fileName.split('.');
            const result = await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error("Error deleting image:", error);
        }
        try {
            const formData = new FormData();
            formData.append("file", profile);
            formData.append("upload_preset", "ecommerce");

            const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: formData
            });
            const data = await response.json();
            profileImg = data.secure_url
            const update = await User.updateOne({ oldEmail }, { profileImg })
            
        } catch (error) {
            console.error("Error uploading image:", error);
        }

    }
    let error = false
    let errorMessage = "";
    const userPromises = c.changes.map(async (change) => {
        const filter = {
            [change]: e.get(change)
        }
        const abc = await User.findOne(filter);
        if (abc) {
            error = true
            errorMessage = `This ${change} is alredy in use`
            return { error: `This ${change} is alredy in use` }
        } else {
            const update = await User.updateOne({ oldEmail }, filter)
            return update;
        }
    });

    const users = await Promise.all(userPromises);

    if (error) {
        return { error: errorMessage }
    } else {
        return { success: true }
    }

}

export const addProduct = async (e) => {
    const productID = e.get("productID")
    const productName = e.get("productName")
    const productPrice = e.get("productPrice")
    const productDisPrice = e.get("productDisPrice")
    const productDiscount = e.get("productDiscount")
    const des = e.get("productDes")
    const category = e.get("category")
    const brand = e.get("brand")
    const quantity = e.get("quantity")
    const img = e.getAll("images")
    const oldEmail = e.get('oldEmail')
    // console.log(oldEmail,"sdfsdf")
    const user = await User.findOne({ oldEmail })
    const isAdmin = user.isAdmin
    if (!isAdmin) {
        return { error: "You are not an Admin" }
    }
    let images = [];
    let ProductDes = des.split("\r\n")
    ProductDes = ProductDes.filter(item => item !== "");
    let large = false
    if (img.length > 5) {
        return { error: "only 5 images are allowed" }
    }
    img.forEach((img) => {
        if (img.size >= 5 * 1024 * 1024) {
            large = true
        }
    })
    if (large) {
        return { error: "The file should be less than 5 mb" }
    }

    await Promise.all(img.map(async (img) => {
        try {
            const formData = new FormData();
            formData.append("file", img);
            formData.append("upload_preset", "ecommerce");

            const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: formData
            });
            const data = await response.json();
            images.push(data.secure_url)
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    }))


    connectDB()
    const oldproduct = await Product.find({ productID })
    if (oldproduct.length > 0) {
        return { error: "This product id already exist" }
    }
    const product = new Product({ productID, productName, productPrice, productDisPrice, productDiscount, ProductDes, category, brand, quantity, images })
    product.save()
    return { success: "true" }
}

export const handleSignUp = async (e) => {
    const username = e.get("username")
    const email = e.get("email")
    const pass = e.get("password")
    const confirmPassword = e.get("confirm-password")

    if (pass === confirmPassword) {
        const password = await bcrypt.hash(pass, 10)
        await connectDB()
        const userExist = await User.findOne({ username })
        const emailExist = await User.findOne({ email })
        if (userExist) {
            return { error: "Username Already Exists" }
        }
        if (emailExist) {
            return { error: "This Email Already Exist" }
        }
        if (!userExist && !emailExist) {
            const newUser = new User({
                username,
                password,
                email,
                oldEmail: email,
            })
            newUser.save()
            return { success: "Registered Succesfully" }
        }
    } else {
        return { error: "Passwords does not match" }
    }
}