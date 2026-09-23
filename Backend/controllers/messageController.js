import { Messages } from "../models/messageModel.js";
import { Conversation } from "../models/conversationModel.js";
import { getReceiverSocketId,io} from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message, isEncrypted = false } = req.body;

        if (!message) {
            return res.status(400).json({
                message: "Message is required"
            });
        }
        if (message.length > 5000) {
            return res.status(400).json({
                message: "Message exceeds maximum length of 5000 characters."
            });
        }

        let gotConversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!gotConversation) {
            gotConversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        const newMessage = await Messages.create({
            senderId,
            receiverId,
            message,
            isEncrypted
        });

        if (newMessage) {
            gotConversation.messages.push(newMessage._id);
        }
                                               
        await Promise.all([gotConversation.save(),newMessage.save()])

        //socket.io

        const receiverSocketIds = getReceiverSocketId(receiverId);
        if (receiverSocketIds && Array.isArray(receiverSocketIds)) {
            receiverSocketIds.forEach(socketId => {
                io.to(socketId).emit("newMessage", newMessage);
            });
        } else if (receiverSocketIds) {
            // Fallback in case it's a single string somehow
            io.to(receiverSocketIds).emit("newMessage", newMessage);
        }

        return res.status(200).json({
            newMessage
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


//get message

export const getMessage = async (req, res) => {
    try{
        const receiverId = req.params.id;
        const senderId = req.id;
       const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages");
        return res.status(200).json(conversation?.messages || []); 
        
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}







// const { message } = req.body;

// if (!message) {
//     return res.status(400).json({
//         message: "Message is required"
//     });
// }