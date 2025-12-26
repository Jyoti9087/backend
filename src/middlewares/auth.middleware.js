import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";


export const verifyJwt=asyncHandler(async(req,res,next)=>{ //next -- its like a green light to move to the next function
    try {
        //it looks for the token in two places.(1)either in browser's cookies or in the header of the request. it clean up the text by removing the word "Bearer"
        const token=req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer","")
    
        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }
     
        //use secret password to decode  the token
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        //it takes the id found inside the token and searches the db for that user (except password and refreshToken)
        const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401,"Invalid access token")
        }
    
       //it attaches the found user information to the request object
        req.user=user;
        next()
    } catch (error) {
        throw new ApiError(401,err?.message||"Invalid AccessToken")
    }
    
}) 