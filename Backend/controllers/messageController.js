import { Messages } from "../models/messageModel.js";
import { Conversation } from "../models/conversationModel.js";
import { getReceiverSocketId,io} from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                message: "Message is required"
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
            message
        });

        if (newMessage) {
            gotConversation.messages.push(newMessage._id);
        }
                                               
        await Promise.all([gotConversation.save(),newMessage.save()])

        //socket.io

        const receiverSocketId =getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
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
        return res.status(200).json(conversation?.messages); 
        
    }
    catch (error) {
        console.error(error);
    }


}







// const { message } = req.body;

// if (!message) {
//     return res.status(400).json({
//         message: "Message is required"
//     });
// }