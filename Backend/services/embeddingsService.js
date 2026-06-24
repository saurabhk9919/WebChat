import { pipeline } from "@xenova/transformers";

let extractor = null;

/**
 * Initializes and returns the feature extraction pipeline.
 * Ensures the model is loaded only once (singleton pattern).
 * @returns {Promise<Function>} - The pipeline extractor function.
 */
export const getExtractor = async () => {
    if (!extractor) {
        extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    }
    return extractor;
};

/**
 * Generates a 384-dimensional vector embedding for the supplied text.
 * @param {string} text - The input text to vectorize.
 * @returns {Promise<number[]>} - Float vector embedding array.
 */
export const generateEmbedding = async (text) => {
    if (!text || typeof text !== "string") {
        throw new Error("Text must be a non-empty string");
    }

    try {
        const pipe = await getExtractor();
        const output = await pipe(text, { pooling: "mean", normalize: true });
        
        if (!output || !output.data) {
            throw new Error("Pipeline returned an invalid response");
        }
        
        return Array.from(output.data);
    } catch (err) {
        console.error(`Failed to generate neural embedding for text: "${text}":`, err.message);
        throw err; // Proper error instead of silent local fallback
    }
};
