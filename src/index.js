

import dotenv from "dotenv"
import connectDB from "./db/index.js";


dotenv.config({
  path:'./env'
})

//after database connection
//return promise
connectDB()
.then(()=>{
  //it means if any port is not available then it takes port as 8000.
  //server start
  app.listen(process.env.PORT || 8000,()=>{
console.log(`Server is running at port :${process.env.PORT}`);


  })
})
.catch((err)=>{
  console.log("MONGO db connection failed !!!",err);
  
})


// import express from "express"
// const app=express()
















//whenever you connect to db,then use async await function and try catch.
//1st approach
// (async()=>{
//     try{
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//     app.on("error",()=>{
//         console.log("ERROR:",error);
//         throw error
        
//     })
  
//     app.listen(process.env.PORT,()=>{
//         console.log(`App is listening on port ${process.env.PORT} `);
        
//     })

//     }catch(error){
//         console.error("ERROR:",error)
//         throw error
//     }
// })()