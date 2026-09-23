import mongoose from "mongoose";

const messageModel = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isEncrypted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["sent", "delivered", "read"],
        default: "sent"
    }
}, {
    timestamps: true
});

export const Messages = mongoose.model("Messages", messageModel);