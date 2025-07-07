import { Router } from "express";
import authMiddleware from "../middlewales/auth.middleware.js";
import { getMessages, getUserForSlider, sendMessages } from "../controllers/msg.controllers.js";

const msgRouter = Router()

msgRouter.route('/users').get(authMiddleware,getUserForSlider)
msgRouter.route('/:id').get(authMiddleware,getMessages)
msgRouter.route('/send/:id').post(authMiddleware,sendMessages)

export default msgRouter;