import mongoose,{Schema} from "mongoose";
import { email, lowercase } from "zod";
import { required } from "zod/mini";
//import the jsonwebtoken library to crete and verify json web tokens
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

// node.bcrypt.js-library to help you hash password
//here we use jsonwebtoken and bcrypt to make tokens

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
     email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
     fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
     avatar:{
        type:String, //cloudinary url
        required:true,
    },
     coverimage:{
        type:String, //cloudinary url
    },
    watchHistory:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    },
    password:{
        type:String,
        required:[true,'password is required']
    },
    refreshToken:{
        type:String
    }
},{timestamps:true})

//pre middleware hook
//here we use function rather than arro function,becoz arrow function does not access "this",

userSchema.pre("save",async function(next){
    //if the password was modified ,it hashes the password,if the password has not changed moves to the next action
    if(!this.isModified("password")) 
    //this.password -> hook
   this.password=await bcrypt.hash(this.password,10) //10-round
  
})

//define a custom method to check if the provided plaintext password is correct or not
userSchema.methods.isPasswordCorrect=async function(password){
    //bcrypt.compare() compare the provided plaintext password with hashed password (this.password) stored in database
    //it will return true or false
   return await bcrypt.compare(password,this.password)
}

//custom method to create and sign a new access token
userSchema.methods.generateAccessToken=function(){
    //use jsonwebtoken to sign(create) the token
   return jwt.sign({
         //defines payloads(data) of the token
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },
    //use the secret key for authenticity.
    process.env.ACCESS_TOKEN_SECRET,
    //sets the token to expire after a duration defined.
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

//custom method to sign new refresh token
userSchema.methods.generateRefreshToken=function(){
     return jwt.sign({
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}


export const User=mongoose.model("User",userSchema)