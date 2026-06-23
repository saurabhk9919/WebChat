import { generateEmbedding } from "../services/embeddingsService.js";
import { cosineSimilarity } from "../services/vectorSearchService.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const searchSemanticGlobal = async (req, res) => {
    try {
        let { query, conversationId } = req.body;
        const currentUserId = req.user._id;

        if (query === undefined || query === null) {
            return res.status(400).json({ message: "Search query is required" });
        }

        if (typeof query !== "string") {
            return res.status(400).json({ message: "Search query must be a string" });
        }

        query = query.trim();

        if (query.length === 0) {
            return res.status(400).json({ message: "Search query cannot be empty" });
        }

        if (query.length > 200) {
            return res.status(400).json({ message: "Search query must be 200 characters or fewer" });
        }

        let queryEmbedding;
        try {
            queryEmbedding = await generateEmbedding(query);
        } catch (embeddingError) {
            console.error("Failed to generate embedding for search query:", embeddingError.message);
            return res.status(500).json({ message: "Failed to generate query embedding" });
        }

        let conversations = [];
        if (conversationId) {
            const conv = await Conversation.findOne({
                _id: conversationId,
                participants: currentUserId
            });
            if (conv) conversations = [conv];
        } else {
            conversations = await Conversation.find({
                participants: currentUserId
            });
        }

        if (conversations.length === 0) {
            return res.status(200).json([]);
        }

        const messageIds = [];
        const msgToConvMap = {};
        conversations.forEach((conv) => {
            if (Array.isArray(conv.messages)) {
                conv.messages.forEach((msgId) => {
                    const idStr = msgId.toString();
                    messageIds.push(msgId);
                    msgToConvMap[idStr] = conv._id;
                });
            }
        });

        if (messageIds.length === 0) {
            return res.status(200).json([]);
        }

        const messages = await Message.find({
            _id: { $in: messageIds },
            embedding: { $exists: true, $not: { $size: 0 } }
        }).populate("senderId", "name email").populate("recieverId", "name email");

        if (messages.length === 0) {
            return res.status(200).json([]);
        }

        const scored = messages.map((msg) => {
            const similarity = cosineSimilarity(queryEmbedding, msg.embedding);
            return {
                message: msg,
                similarity
            };
        });

        const minSimilarityThreshold = 0.35;
        const topMatches = scored
            .filter((item) => item.similarity >= minSimilarityThreshold)
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 10);

        const results = topMatches.map((item) => ({
            message: item.message,
            conversationId: msgToConvMap[item.message._id.toString()],
            similarityScore: item.similarity
        }));

        return res.status(200).json(results);
    } catch (error) {
        console.error("Error in searchSemanticGlobal:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
