import express from "express"
//this means ,cores allows a web browser to permit web pages to request resources from different domain.thses are middleware
import cors from "cors"
//cores-Cross-Origin Resource Sharing
//use to parse incoming http request cookies
import cookieParser from "cookie-parser"


//middleware is a function that express runs for every incoming request

const app=express()

//apply cores middlewares to the express application
app.use(cors({
    //this tells browser which frontend domain are permitted to make request
    origin:process.env.CORS_ORIGIN,
    //this allows ur frontend to send sensitive information like cookies to backend
    credentials:true
}))

// json body-16kb
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
//any file from the folder can be accessed directly by url path
app.use(express.static("public"))

app.use(cookieParser())

//routes import
import userRouter from "./routes/user.routes.js"

//routes declaration
// app.use("/users",userRouter)//http://localhost:8000/users
app.use("/api/v1/users",userRouter)//http://localhost:8000/api/v1/users


//this makes the app object availble for other files
export { app }
