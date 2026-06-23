import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { io, getRecieverSocketId } from "../SocketIO/server.js";
import { buildConversationSummary } from "../services/groqService.js";
import { extractActionFromMessage } from "../services/actionExtractionService.js";

export const sendMessage = async (req, res) => {
    // console.log("Send message controller",req.params.id, req.body.message);
    try {
        const { message } = req.body;
        const { id: recieverId } = req.params;
        const senderId = req.user._id;//logged in user id from auth middleware

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recieverId] }
        });
        //if no conversation exists create new
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, recieverId],

            });
        }

        let detectedAction = null;
        try {
            detectedAction = await extractActionFromMessage(message);
            console.log("Detected Action:", detectedAction);
        } catch (error) {
            console.log("Action Detection Error:", error.message);
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            message,
            detectedAction
        });
        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }
        //save both
        await Promise.all([newMessage.save(), conversation.save()]);//save both message and conversation on database

        //round
        generateEmbedding(message)
            .then(async (embedding) => {
                newMessage.embedding = embedding;
                await newMessage.save();
                console.log(`Successfully saved vector embedding for message ${newMessage._id}`);
            })
            .catch((err) => {
                console.error(`Failed to generate background embedding for message ${newMessage._id}:`, err.message);
            });

        const recieverSocketId = getRecieverSocketId(recieverId);
        if (recieverSocketId) {
            io.to(recieverSocketId).emit("newMessage", {
                _id: newMessage._id,
                senderId: newMessage.senderId,
                recieverId: newMessage.recieverId,
                message: newMessage.message,
                createdAt: newMessage.createdAt,
                updatedAt: newMessage.updatedAt,
                detectedAction
            });
        }


        return res.status(201).json({ message: "Message sent successfully", newMessage, detectedAction });
    }
    catch (err) {
        console.log("Error in sending message", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: chatuser } = req.params;//id of other user in chat to see other and older chats
        const senderId = req.user._id;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, chatuser] },
        }).populate('messages');                 //to see the written messages
        if (!conversation) {
            return res.status(200).json({ message: "No conversation found" });
        }
        const messages = conversation.messages;
        return res.status(200).json({ messages });//return messages array
    }
    catch (error) {
        console.log("Message getting error" + error);
        res.status(500).json({ message: "Internal server error" });
    }

}

export const getConversationSummary = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { limit, summaryType } = req.body || {};
        const senderId = req.user._id;

        if (!conversationId) {
            return res.status(400).json({ message: "conversationId is required" });
        }

        console.log('Summary request:', { conversationId, senderId, limit, summaryType });

        const conversation = await Conversation.findOne({
            _id: conversationId,
        }).populate('messages') || await Conversation.findOne({
            participants: { $all: [senderId, conversationId] },
        }).populate('messages');

        console.log('Conversation found:', !!conversation);
        if (!conversation) {
            const count = await Conversation.countDocuments({ participants: senderId });
            console.log('Sender has conversations:', count);
        }

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        const messages = Array.isArray(conversation.messages) ? conversation.messages : [];
        console.log('Messages count:', messages.length);

        const summary = await buildConversationSummary({
            messages,
            limit,
            summaryType,
        });

        return res.status(200).json({
            summary: summary.summary,
            keyPoints: summary.keyPoints,
            actionItems: summary.actionItems,
            decisions: summary.decisions,
        });
    } catch (error) {
        console.log("Message summary error" + error);
        const statusCode = error?.statusCode || 500;
        return res.status(statusCode).json({ message: error?.message || "Internal server error" });
    }
}

export const detectAction = async (req, res) => {
    try {

        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                message: "Message is required"
            });
        }

        const action = await extractActionFromMessage(message);

        return res.status(200).json(action);

    } catch (error) {

        console.log(error);

        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error"
        });
    }
};

export const dismissAction = async (req, res) => {
    try {
        const { id } = req.params;
        const msg = await Message.findById(id);
        if (!msg) {
            return res.status(404).json({ message: "Message not found" });
        }
        if (msg.detectedAction) {
            msg.detectedAction = { ...msg.detectedAction, intent: "NONE" };
            await msg.save();
        }
        return res.status(200).json({ message: "Action dismissed successfully", msg });
    } catch (error) {
        console.error("Error in dismissAction:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};