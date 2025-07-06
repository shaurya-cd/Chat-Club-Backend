import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//Resgister user

const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
} 

const registerUser = asyncHandler( async (req , res) => {

    
})

const loginUser = asyncHandler( async (req,res) => {

    
})

const logoutUser = asyncHandler( async (req,res) => {

})


export{
    registerUser,loginUser,logoutUser
}