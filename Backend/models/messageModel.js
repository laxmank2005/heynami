import mongoose from "mongoose";

const messageModel = new mongoose.Schema({
    senderId :{
         type : mongoose.Schema.Types.ObjectId,
        ref:"User",
        required : true
    },
    receiverId:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
        required : true

    }
},{timestamps:true});
export const Messages = mongoose.model("Messages", messageModel);