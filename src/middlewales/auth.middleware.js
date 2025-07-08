import jwt from'jsonwebtoken'
import { User } from '../models/user.model.js';

const authMiddleware = async (req,res,next) => {
    try {
        const {token} = req.cookie;
        if (!token) {
            return res.status(401).json({success:false,message:"Unauthorized - Login again"})
        }

        const token_decode = jwt.verify(token,process.env.JWT_SECRET)

        if (!token_decode) {
            return res.status(401).json({message:"Unauthorized - Invalid token"})
        }

        const user = await User.findById(token_decode.id).select("-password")

        if (!user) {
            return res.status(404).json({message:"User not found"})
        }

        req.user = user

        next();
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}

export default authMiddleware;