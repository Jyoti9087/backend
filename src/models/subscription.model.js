import mongoose from "mongoose";
import { Schema } from "zod/v3";

const subscriptionSchema=new Schema({
    subscriber:{
        type:mongoose.Schema.Types.ObjectId, //one who is subscribing
        ref:"User"
    },
    channel:{
        type:mongoose.Schema.Types.ObjectId, //to whom subscribing
        ref:"User"
    }
},{Timestamps:true})

export const Subscription=mongoose.model("Subscription",subscriptionSchema)