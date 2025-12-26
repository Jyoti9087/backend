import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


//create method by merging both access and refresh token
  const generateAccessAndRefreshToken=async(userid)=>{
        try {
            //it finds user by id
            const user=await User.findById(userid)
            //call the method to generate token
            const accessToken=user.generateAccessToken()
            const refreshToken=user.generateRefreshToken()

            //save in the database
            user.refreshToken=refreshToken
            await user.save({validateBeforeSave:false})

            return {accessToken,refreshToken}

        } catch (error) {
            throw new ApiError(500,"something went wrong while generating refresh and access token")
        }
    }




//register user
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
    // console.log("email:",email); //email: jessicaa@23774774855
    // console.log(req.body);
    

    //2.validation(conditions) -- one way
    // if(fullname===""){
    //    throw new ApiError(400,"fullname is required")
    // }
    //then for all other fields
    

    //another way(checking all conditions at once)
    if(
       [fullname,email,username,password].some((field)=> field?.trim()==="")
         //it means,field===null || field===undefined || field.trim()===""
    ){
       throw new ApiError(400,"All fields are required")
    }

    //3.check if user already exist
    // User.findOne({email})
    //we can write this,but if we want to check multiple fields like email or username,then
    const existedUser=await User.findOne(
        {
            $or:[{ email },{ username }]
        }
    )

    if(existedUser){
        throw new ApiError(409,"user with email and username already exists")  
    }

    console.log(req.files);
    //output
//     [Object: null prototype] {
//   coverimage: [
//     {
//       fieldname: 'coverimage',
//       originalname: 'coverimage.png',
//       encoding: '7bit',
//       mimetype: 'image/png',
//       destination: './public',
//       filename: 'coverimage.png',
//       path: 'public\\coverimage.png',
//       size: 77870
//     }
//   ],
//   avatar: [
//     {
//       fieldname: 'avatar',
//       originalname: 'avatar.png',
//       encoding: '7bit',
//       mimetype: 'image/png',
//       destination: './public',
//       filename: 'avatar.png',
//       path: 'public\\avatar.png',
//       size: 68962
//     }
//   ]
// }


    //4.check for images,check for avater
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length >0){
        coverImageLocalPath=req.files.coverimage[0].path
    }

    // const avatarLocalPath=req.files?.avatar[0]?.path;
  

    if(!avatarLocalPath){
       throw new ApiError(400,"Avater file is required ")
    }



    //5.upload to cloudinary
    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverimage=await uploadOnCloudinary(coverImageLocalPath )

    if(!avatar){
         throw new ApiError(400,"Avater file is required ")
    }


    //6.create user object
    const user=await User.create({
        fullname,
        avatar:avatar.url,
        coverimage:coverimage?.url || "",
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


//login user
const loginUser=asyncHandler(async(req,res)=>{
    
    //req body --> data
    //username or email
    //find the user
    //password check
    //access and refresh token
    //send cookie
   
    //req body --> data
    const{email,username,password}=req.body

    if(!username && !email){
        throw new ApiError(400,"username or password is required")
    }

   //username or email(uses $or operator in mongodb to find user that matches either a username or an email)
    const user=await User.findOne({
    $or:[{username},{email}]
   })

   //find the user(if both missing)
   if(!user){
    throw new ApiError(404,"user does not exist")
   }

    //password check
    const isPasswordValid=await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        // throw new ApiError(404,"password is incorrect")
        throw new ApiError(404,"invalid user credential")
    }

    //access and refresh token
  
    const {accessToken,refreshToken} =await generateAccessAndRefreshToken(user._id)


   //this ensure sensitive data like password and the token are not sent back to the frontend in the json response
    const loggedInUser=User.findById(user._id).select("-password -refreshToken")

    
    //send cookies
    const options={
        httpOnly:true, //it means we can not modify ya check it in frontend,but only in server side
        secure:true
    }

    //return response
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,{user:loggedInUser,accessToken,refreshToken},"user loggedin successfully")
    )



})


//log out
const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true //when you get the res,then you got new updated value not the old value
        }
    )

    //cookies
    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged out"))
})


//endpoint
const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingrefreshToken=req.cookies.refreshToken || req.body.refreshToken

    if(!incomingrefreshToken){
        throw new ApiError(401,"Unauthorized request")
    }

    try {
        const decodedToken=jwt.verify(
            incomingrefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user=await User.findById(decodedToken?._id)
    
         if(!user){
            throw new ApiError(401,"invalid refresh token")
        }
    
        if(incomingrefreshToken != user?.refreshToken){
            throw new ApiError(401,"refresh token is expired")
        }
    
        const options={
            httpOnly:true,
            secure:true
        }
    
        const {accessToken,newrefreshToken}=await generateAccessAndRefreshToken(user._id)
    
        return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",newrefreshToken,options)
        .json(
            new ApiResponse(
                200,{accessToken,refreshToken:newrefreshToken},"Access token refreshed*"
            )
        )
    
    
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid refresh token")
    }
})


export {registerUser,loginUser,logoutUser}