import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './src/lib/db.js'
import { app, server } from './src/lib/socket.js'


//app config
const port = process.env.PORT || 8000
dotenv.config({
    path: './.env'
})

//middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({extended: true, limit: '10mb' }))
app.use(express.static("public"))
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

//db connection
connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("Error ", error)
        throw error
    })

    server.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port : ${port}`)
    })
})
.catch((err)=>{
    console.log("MongoDB connection failed !!! ", err)
})


//Routes import
import userRouter from './src/routes/user.routes.js'
import msgRouter from './src/routes/message.routes.js'


//api endpoints
app.use('/api/v1/user',userRouter)
app.use('/api/v1/msg',msgRouter)



//api working check
app.get('/', ( req, res )=>{
    res.send('API WORKING')
})