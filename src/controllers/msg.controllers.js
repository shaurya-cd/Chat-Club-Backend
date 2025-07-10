import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { asyncHandler } from "../utils/asyncHandler.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";


const getUserForSlider = asyncHandler (async (req,res) => {
    try {
        const loggedInUser = req.user._id
        const filteredUser = await User.find({_id:{$ne:loggedInUser}}).select("-password")

        return res.status(200).json(filteredUser)
    } catch (error) {
        console.log("Error in getUserForSlider",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
})

const getMessages = asyncHandler (async (req,res) => {
    try {
        const { id:userToChatId } = req.params
        const myId = req.user._id
        const messages = await Message.find({
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        })

        return res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
})

const sendMessages = asyncHandler( async (req,res) => {
    try {
        const { text, image } = req.body
        const { id:receiverId } = req.params
        const senderId = req.user._id

        let imageUrl;
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        await newMessage.save()

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(201).json(newMessage)

    } catch (error) {
        console.log("Error in sendMessages",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
})

export{
    getUserForSlider,getMessages,sendMessages
}