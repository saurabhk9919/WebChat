const GROQ_EMBEDDINGS_URL = "https://api.groq.com/openai/v1/embeddings";
const EMBEDDINGS_MODEL = "nomic-embed-text-v1.5";

/**
 * Deterministic local string hashing helper.
 * @param {string} str - String to hash.
 * @returns {number} - Positive hash value.
 */
const getHash = (str) => {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return Math.abs(hash);
};

/**
 * Generates a 768-dimension local vector representation using the Hashing Trick.
 * Used as a zero-latency fallback when remote model API fails.
 * @param {string} text - Input text.
 * @returns {number[]} - 768-dimension float vector normalized to L2 norm of 1.0.
 */
export const generateEmbeddingLocal = (text) => {
    const vector = new Array(768).fill(0);
    if (!text || typeof text !== "string") return vector;

    const words = text.toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(w => w.length > 0);

    if (words.length === 0) return vector;

    for (const word of words) {
        for (let seed = 0; seed < 3; seed++) {
            const h = getHash(word + seed);
            const index = h % 768;
            vector[index] += 1;
        }
    }

    let sumSquares = 0;
    for (let i = 0; i < 768; i++) {
        sumSquares += vector[i] * vector[i];
    }
    const norm = Math.sqrt(sumSquares);
    if (norm > 0) {
        for (let i = 0; i < 768; i++) {
            vector[i] /= norm;
        }
    }

    return vector;
};

/**
 * Generates a 768-dimension vector embedding for the supplied text.
 * Falls back gracefully to local vector projection if the Groq API model fails.
 * @param {string} text - The input text to vectorize.
 * @returns {Promise<number[]>} - Float vector embedding array.
 */
export const generateEmbedding = async (text) => {
    if (!text || typeof text !== "string") {
        throw new Error("Text must be a non-empty string");
    }

    // If GROQ_API key is missing, fall back directly to local hashing vectorizer
    if (!process.env.GROQ_API) {
        console.warn("GROQ_API key is missing. Using local vectorizer fallback.");
        return generateEmbeddingLocal(text);
    }

    try {
        const response = await fetch(GROQ_EMBEDDINGS_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.GROQ_API}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: EMBEDDINGS_MODEL,
                input: text.replace(/\n/g, " "),
            }),
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => "");
            throw new Error(`Groq Embeddings request failed (${response.status}): ${errorText}`);
        }

        const payload = await response.json();
        const embedding = payload?.data?.[0]?.embedding;
        
        if (!Array.isArray(embedding)) {
            throw new Error("Groq API returned an invalid embedding array");
        }

        return embedding;
    } catch (err) {
        console.warn(`Groq Embeddings API error: "${err.message}". Falling back to local vectorizer.`);
        return generateEmbeddingLocal(text);
    }
};
