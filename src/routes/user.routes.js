import { Router } from "express";
import { registerUser, loginUser, logoutUser, updateProfile, checkAuth } from "../controllers/user.controllers.js";
import authMiddleware from "../middlewales/auth.middleware.js";

const userRouter = Router()

userRouter.route('/signup').post(registerUser)
userRouter.route('/login').post(loginUser)
userRouter.route('/logout').post(logoutUser)
userRouter.route('/update').put(authMiddleware,updateProfile)
userRouter.route('/check').get(authMiddleware,checkAuth)

export default userRouter;