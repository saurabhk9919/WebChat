import { buildSummaryPrompt, normalizeSummaryType } from "../prompts/summaryPrompt.js";

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'qwen/qwen3.6-27b';

const LIMIT_TO_COUNT = {
    'last-5': 5,
    'last-10': 10,
    'last-20': 20,
    'last-50': 50,
    'last-100': 100,
    'entire-conversation': null,
};

class SummaryServiceError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = 'SummaryServiceError';
        this.statusCode = statusCode;
    }
}

const getRequestedMessages = (messages, limit) => {
    const sortedMessages = [...messages].sort((first, second) => {
        const firstTime = new Date(first?.createdAt || 0).getTime();
        const secondTime = new Date(second?.createdAt || 0).getTime();
        return firstTime - secondTime;
    });

    const limitCount = LIMIT_TO_COUNT[limit] ?? LIMIT_TO_COUNT['last-5'];

    if (limitCount === null) {
        return sortedMessages;
    }

    return sortedMessages.slice(Math.max(sortedMessages.length - limitCount, 0));
};

const safeParseJson = (content) => {
    if (typeof content !== 'string' || !content.trim()) {
        throw new SummaryServiceError('Groq returned an empty response', 502);
    }

    try {
        return JSON.parse(content.trim());
    } catch (error) {
        throw new SummaryServiceError('Groq returned invalid JSON', 502);
    }
};

const normalizeSummaryResponse = (responseBody) => {
    const summary = typeof responseBody?.summary === 'string' ? responseBody.summary : '';
    const keyPoints = Array.isArray(responseBody?.keyPoints) ? responseBody.keyPoints.filter((item) => typeof item === 'string') : [];
    const actionItems = Array.isArray(responseBody?.actionItems) ? responseBody.actionItems.filter((item) => typeof item === 'string') : [];
    const decisions = Array.isArray(responseBody?.decisions) ? responseBody.decisions.filter((item) => typeof item === 'string') : [];

    return {
        summary,
        keyPoints,
        actionItems,
        decisions,
    };
};

export const buildConversationSummary = async ({ messages, limit, summaryType }) => {
    if (!process.env.GROQ_API) {
        throw new SummaryServiceError('Missing GROQ_API environment variable', 500);
    }

    if (!Array.isArray(messages) || messages.length === 0) {
        throw new SummaryServiceError('Empty conversation', 400);
    }

    const selectedLimit = Object.prototype.hasOwnProperty.call(LIMIT_TO_COUNT, limit)
        ? limit
        : 'last-5';
    const selectedSummaryType = normalizeSummaryType(summaryType);
    const requestedMessages = getRequestedMessages(messages, selectedLimit);

    if (!requestedMessages.length) {
        throw new SummaryServiceError('Empty conversation', 400);
    }

    const messagesForPrompt = buildSummaryPrompt({
        messages: requestedMessages,
        summaryType: selectedSummaryType,
    });

    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.GROQ_API}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: GROQ_MODEL,
            messages: messagesForPrompt,
            temperature: 0.2,
            response_format: { type: 'json_object' },
        }),
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new SummaryServiceError(`Groq request failed${errorText ? `: ${errorText}` : ''}`, 502);
    }

    const payload = await response.json().catch(() => {
        throw new SummaryServiceError('Groq request returned an unreadable response', 502);
    });

    const content = payload?.choices?.[0]?.message?.content;
    const parsedContent = safeParseJson(content);

    return normalizeSummaryResponse(parsedContent);
};

export { SummaryServiceError };