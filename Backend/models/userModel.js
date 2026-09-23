import mongoose from "mongoose";

const userModel=new mongoose.Schema({
    fullName :{
        type:String,
        required:true
    },
    email :{
        type:String,
        required:true,
        unique:true
    },
    mobile :{
        type:String,
        required:true,
        unique:true
    },
    password :{
        type:String,
        required:true
    },
    gender :{
        type:String,
        enum:["male","female","other"],
        required:true
    },
    profilePhoto :{
        type:String,
        default:""
    },
    isEmailVerified :{
        type:Boolean,
        default:false
    },
    otp :{
        type:String
    },
    otpExpiry :{
        type:Date
    }

},{timestamps:true});
export const User = mongoose.model("User",userModel);  ///////////**** */


