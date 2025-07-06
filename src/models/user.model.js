import mongoose, {Schema} from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new Schema(
    {
        fullName:{
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
        },
        password:{
            type: String,
            required: [true, "Password id required"],
            minlength:6
        },
        ProfilePic:{
            type: String,
            default: ""
        },
        refreshToken:{
            type: String
        }
    },{timestamps: true}
)

export const User = mongoose.model("User", userSchema)