import mongoose from "mongoose";

const userModel=new mongoose.Schema({
    fullName :{
        type:String,
        required:true
    },
    userName :{
        type:String,
        required:true
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
    }

},{timestamps:true});
export const User = mongoose.model("User",userModel);  ///////////**** */