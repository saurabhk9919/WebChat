import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
   // console.log("Send message controller",req.params.id, req.body.message);
    try{
        const {message} = req.body;
        const {id:recieverId} = req.params;
        const senderId = req.user._id;//logged in user id from auth middleware

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recieverId] }
        });
        //if no conversation exists create new
        if(!conversation){
            conversation = await Conversation.create({
                participants: [senderId, recieverId],
            
            }); 
            const newMessage = new Message({
                 senderId,
                 recieverId,
            message,
   });
   if(newMessage){
    conversation.messages.push(newMessage._id);
   }
   //save both
   await Promise.all([  newMessage.save(), conversation.save() ]);
 return res.status(200).json({ message: "Message sent successfully", newMessage });
        }

    }
    catch(err){
        console.log("Error in sending message", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try{
        const { id:chatuser } = req.params;//id of other user in chat to see other and older chats
        const senderId = req.user._id;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, chatuser] },
        }).populate('messages');                 //to see the written messages
        if(!conversation){
            return res.status(200).json({ message: "No conversation found" });
        }
        const messages= conversation.messages;
        return res.status(200).json({ messages });//return messages array
    }
    catch(error){
        console.log("Message getting error"+error);
            res.status(500).json({ message: "Internal server error" });
    }

}
