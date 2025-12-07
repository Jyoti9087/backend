//this file provide a utility function in a node.js application (using Express.js)to handle asynchronous operation and utomatically catch error 

// asyncHandler is the main function that return another function(an express middleware)
const asyncHandler=(requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).
        reject((err)=>next(err))
        //if any error occured in requestHandler then thisline catches the error(err)  and passes to express error handler using next(err)
    }
}



// import { success } from "zod"

export {asyncHandler}


// const asyncHandler=()=>{}
// const asyncHandler=(fun)=>()=>{}
// const asyncHandler=(fun)=>async()=>{}


//one way
// const asyncHandler=(fun)=>async(req,res,next)=>{
//     try {
//         await fun(req,res,next)
        
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success:false,
//             message:error.message
//         })
//     }
// }