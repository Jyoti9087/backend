import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser=asyncHandler(async(req,res)=>{
    // res.status(200).json({
    //     messege:"hello world "
    // })

    //steps
    //get user details from frontend
    //validation(conditions)--eg:not empty
    //check if user already exist:usrname,email
    //check for images,check for avater
    //upload them to cloudinary
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return response

    // //1.get user details from frontend
    const{fullname,email,username,password}=req.body
    console.log("email:",email);

    //2.validation(conditions) -- one way
    // if(fullname===""){
    //    throw new ApiError(400,"fullname is required")
    // }
    //then for all other fields
    

    //another way(checking all conditions at once)
    if(
       [fullname,email,username,password].some((field)=>{
         field?.trim()===""
         //it means,field===null || field===undefined || field.trim()===""
       })
    ){
       throw new ApiError(400,"All fields are required")
    }

    //3.check if user already exist
    // User.findOne({email})
    //we can write this,but if we want to check multiple fields like email or username,then
    const existedUser=User.findOne(
        {
            $or:[{ email },{ username }]
        }
    )

    if(existedUser){
        throw new ApiError(409,"user with email and username already exists")  
    }


    //4.check for images,check for avater
    const avatarLocalPath=req.files?.avater[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path; 

    if(!avatarLocalPath){
       throw new ApiError(400,"Avater file is required ")
    }



    //5.upload to cloudinary
    const avater=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath )

    if(!avater){
         throw new ApiError(400,"Avater file is required ")
    }


    //6.create user object
    const user=await User.create({
        fullname,
        avatar:avater.url,
        coverImage:coverImage?.url ||"",
        email,
        password,
        username:username.toLowerCase()
    })
    //check wheather it is created in db or not
    const createdUser=await User.findById(user._id)
    //remove password and refresh token field from response
    .select("-password -refreshToken")

       //check for user creation
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    //return response
    return res.status(201).json(
        new ApiResponse(200,createdUser,"user registered successfully")
    )
     

})

export {registerUser}