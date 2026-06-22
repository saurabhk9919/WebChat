import actionPrompt from "../prompts/actionPrompt.js";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";

class ActionExtractionError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = "ActionExtractionError";
        this.statusCode = statusCode;
    }
}

const safeParseJSON = (content) => {
    if (!content || typeof content !== "string") {
        throw new ActionExtractionError("Groq returned an empty response", 502);
    }

    try {
        return JSON.parse(content.trim());
    } catch (err) {
        throw new ActionExtractionError("Groq returned invalid JSON", 502);
    }
};

export const extractActionFromMessage = async (message) => {

    if (!process.env.GROQ_API) {
        throw new ActionExtractionError("Missing GROQ_API environment variable",500);
    }

    const response = await fetch(GROQ_API_URL,{
        method:"POST",
        headers:{
            Authorization:`Bearer ${process.env.GROQ_API}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            model:GROQ_MODEL,
            temperature:0.2,
            response_format:{ type:"json_object" },
            messages:[
                {
                    role:"system",
                    content:actionPrompt
                },
                {
                    role:"user",
                    content:message
                }
            ]
        })
    });

    if(!response.ok){
        const errorText = await response.text().catch(()=> "");

        throw new ActionExtractionError(
            `Groq request failed ${errorText}`,
            502
        );
    }

    const payload = await response.json();

    const content = payload?.choices?.[0]?.message?.content;

    return safeParseJSON(content);
};

export { ActionExtractionError };