 //connect to database(here mongodb connected)
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"

// import express from "express"
// const app=express()

const connectDB=async ()=>{
    try{
     const connectioInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
     console.log(`\n MongoDB connected !! DB HOST:${connectioInstance.connection.host}`); // MongoDB connected !! DB HOST:ac-sbwxzkl-shard-00-00.xowcbsq.mongodb.net
     

    }catch(error){
      console.log("MONGODB connection failed",error); //MONGODB connection failed Error: querySrv ENOTFOUND _mongodb._tcp.2025(if you change anything in uri)
      //you can use process anywhere
      process.exit(1)
    }

}

export default connectDB