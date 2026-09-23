import { Messages } from "../models/messageModel.js";
import { Conversation } from "../models/conversationModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message, isEncrypted = false } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }
        if (message.length > 5000) {
            return res.status(400).json({ message: "Message exceeds maximum length of 5000 characters." });
        }

        let gotConversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!gotConversation) {
            gotConversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        // If receiver is currently online, mark as delivered immediately
        const receiverSocketIds = getReceiverSocketId(receiverId);
        const isReceiverOnline = receiverSocketIds && receiverSocketIds.length > 0;

        const newMessage = await Messages.create({
            senderId,
            receiverId,
            message,
            isEncrypted,
            status: isReceiverOnline ? "delivered" : "sent"
        });

        if (newMessage) {
            gotConversation.messages.push(newMessage._id);
        }

        await Promise.all([gotConversation.save(), newMessage.save()]);

        // Emit to receiver via socket
        if (isReceiverOnline) {
            receiverSocketIds.forEach(socketId => {
                io.to(socketId).emit("newMessage", newMessage);
            });
        }

        // Also notify sender about the delivery status update
        const senderSocketIds = getReceiverSocketId(senderId);
        if (senderSocketIds && senderSocketIds.length > 0) {
            senderSocketIds.forEach(socketId => {
                io.to(socketId).emit("messageStatusUpdate", {
                    messageId: newMessage._id,
                    status: newMessage.status
                });
            });
        }

        return res.status(200).json({ newMessage });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Mark all messages from a sender as "read"
export const markAsRead = async (req, res) => {
    try {
        const receiverId = req.id; // The person who is reading (logged-in user)
        const senderId = req.params.senderId;

        // Update all "sent"/"delivered" messages from this sender to "read"
        const result = await Messages.updateMany(
            {
                senderId,
                receiverId,
                status: { $in: ["sent", "delivered"] }
            },
            { $set: { status: "read" } }
        );

        // Notify the sender (via socket) that their messages were read
        if (result.modifiedCount > 0) {
            const senderSocketIds = getReceiverSocketId(senderId);
            if (senderSocketIds && senderSocketIds.length > 0) {
                senderSocketIds.forEach(socketId => {
                    io.to(socketId).emit("messagesRead", {
                        byUserId: receiverId,
                        fromUserId: senderId
                    });
                });
            }
        }

        return res.status(200).json({ success: true, updated: result.modifiedCount });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get messages
export const getMessage = async (req, res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.id;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages");
        return res.status(200).json(conversation?.messages || []);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// const { message } = req.body;