import { Conversation } from "../models/conversationModel.js";
import { Messages } from "../models/messageModel.js";


export const sendMessage = async (req, res) => {
  try {
    const  senderId  = req.id; 
   const receiverId  = req.params.id;
   const { message } = req.body;

   let gotConversation = await Conversation.findOne({
    participants:{$all :[senderId,receiverId]},
    });
    if(!gotConversation){
        gotConversation = await Conversation.create({
            participants:[senderId,receiverId]
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

    gotConversation.save()
    

    //SOCKRT IO
}catch (error) {   
    console.error(error);

 }
}

