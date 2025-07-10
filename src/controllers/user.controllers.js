import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import cloudinary from "../lib/cloudinary.js";

//Resgister user

const createToken = (id, res) =>{
    const token = jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })

    res.cookie("token",token,{
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
        sameSite: "strict",
        secure:process.env.NODE_ENV !== "development"  
    })

    return token;
} 

const registerUser = asyncHandler( async (req , res) => {
    const { fullName, email, password } = req.body

    try {

        if (!fullName || !email) {
            return res.status(400).json({message:"All fields are required"})
        }

        if (password.length < 6) {
            return res.status(400).json({message:"Password must be at least 6 characters"})
        }

        const user = await User.findOne({email})

        if (user) {
            return res.status(400).json({message:"Email already exists"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            fullName,
            email,
            password:hashedPassword
        })

        if (newUser) {
            createToken(newUser._id, res)
            await newUser.save()
            return res.status(201).json({data:{
                id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                ProfilePic:newUser.ProfilePic
            }, message:"Registeration Successfull"})
        } else {
            return res.status(400).json({message:"Invalid user data"})
        }

    } catch (error) {
        console.log("Error in SignUp controller",error.message)
        return res.status(500).json({message: "Internal Server Error"})
    }
    
})

const loginUser = asyncHandler( async (req,res) => {

    const {email, password} = req.body

    try {
        const user = await User.findOne({email})

        if (!user) {
            return res.status(400).json({message:"Invalid credentials"})
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password)

        if (!isPasswordCorrect) {
            return res.status(400).json({message:"Password is incorrect"})
        }

        createToken(user._id,res)
        res.status(200).json({data:{
            id:user._id,
            fullName:user.fullName,
            email:user.email,
            ProfilePic:user.ProfilePic
        },message:"Login Successfull"})

    } catch (error) {
        console.log("Error in login Controller",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
})

const logoutUser = asyncHandler( async (req,res) => {
    try {
        return res.cookie("token","",{
            maxAge:0
        }).status(200).json({message:"Logged Out Successfully"})
    } catch (error) { 
        console.log("Error in logout Controller",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
})

const updateProfile = asyncHandler ( async (req, res) => {

    try {
        const { ProfilePic } = req.body
        const userId = req.user._id

        if (!ProfilePic) {
            return res.status(400).json({message:"Profile pic is required"})
        }

        const uploadResponse = await cloudinary.uploader.upload(ProfilePic)

        if (!uploadResponse) {
            return res.status(400).json({message:"Error while uploading"})
        }

        const updatedUser = await User.findByIdAndUpdate(userId,{ProfilePic:uploadResponse.secure_url},{new:true})

        res.status(200).json(updatedUser)

    } catch (error) {
        console.log("Error in updating profile",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }

})

const checkAuth = asyncHandler ( async (req, res) => { 
    const user = req.user
    try {
        return res.status(200).json(user)
    } catch (error) {
        console.log("Error in checkAuth",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }

})

export{
    createToken,registerUser,loginUser,logoutUser,updateProfile,checkAuth
}