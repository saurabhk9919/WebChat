import mongoose from "mongoose";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";

const conversationSchema = new mongoose.Schema({
    participants: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        }
    ],
    messages: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: Message,
      default: [],
    },],
}, {
    timestamps: true,

});
const Conversation = mongoose.model("conversation", conversationSchema);
export default Conversation;