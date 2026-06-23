import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { generateEmbedding } from "./embeddingsService.js";

/**
 * Calculates the cosine similarity between two float vector arrays.
 * @param {number[]} vecA - Vector A
 * @param {number[]} vecB - Vector B
 * @returns {number} - Cosine similarity score (between -1.0 and 1.0)
 */
export const cosineSimilarity = (vecA, vecB) => {
    if (!Array.isArray(vecA) || !Array.isArray(vecB) || vecA.length !== vecB.length) {
        return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) {
        return 0; // Return 0 if either vector is all-zeros
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

/**
 * Performs semantic vector search over messages in a conversation.
 * @param {string} queryText - The text query to search.
 * @param {string} conversationId - Conversation ID or Participant User ID.
 * @param {string} currentUserId - The ID of the current logged-in user.
 * @returns {Promise<Object[]>} - Top 10 matching message objects sorted by similarity score.
 */
export const searchSemantic = async (queryText, conversationId, currentUserId = null) => {
    if (!queryText || !queryText.trim()) {
        throw new Error("Search query must be a non-empty string");
    }

    // 1. Generate the vector embedding for the search query
    const queryEmbedding = await generateEmbedding(queryText);

    // 2. Locate the target conversation
    let conversation = await Conversation.findById(conversationId);
    if (!conversation && currentUserId) {
        conversation = await Conversation.findOne({
            participants: { $all: [currentUserId, conversationId] }
        });
    }

    if (!conversation || !conversation.messages || conversation.messages.length === 0) {
        return [];
    }

    // 3. Load all conversation messages that have generated embeddings
    const messages = await Message.find({
        _id: { $in: conversation.messages },
        embedding: { $exists: true, $not: { $size: 0 } }
    });

    if (messages.length === 0) {
        return [];
    }

    // 4. Score each message based on vector similarity
    const scoredResults = messages.map((msg) => {
        const similarity = cosineSimilarity(queryEmbedding, msg.embedding);
        return {
            message: msg,
            similarity
        };
    });

    // 5. Sort by score descending and return the top 10 matches
    const minSimilarityThreshold = 0.35; // Semantic similarity cutoff score
    const topMatches = scoredResults
        .filter((item) => item.similarity >= minSimilarityThreshold)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 10);

    // Format output including the similarityScore
    return topMatches.map((item) => ({
        ...item.message.toObject(),
        similarityScore: item.similarity
    }));
};
