
import mongoose from "mongoose";


const ConversationModel = new mongoose.Schema({

    participants :[{
        type : mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    messages :[{
        type : mongoose.Schema.Types.ObjectId,
        ref:"Messages"
    }]
},{timestamps:true});

// Index for performance
ConversationModel.index({ participants: 1 });

export const Conversation = mongoose.model("Conversation",ConversationModel);