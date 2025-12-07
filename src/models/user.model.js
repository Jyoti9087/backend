import mongoose,{Schema} from "mongoose";
import { email, lowercase } from "zod";
import { required } from "zod/mini";
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
     avater:{
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

//pre middleware
//here we use function rather than arro function,becoz arrow function does not access "this",

userSchema.pre("save",async function(next){

    if(!this.isModified("password")) return (next);
    //this.password -> hook
   this.password=bcrypt.hash(this.password,10) //10-round
   next()
})

userSchema.methods.isPasswordCorrect=async function(password){
   return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken=function(){
   return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshToken=function(){
     return jwt.sign({
        _id:this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}


export const User=mongoose.model("User",userSchema)