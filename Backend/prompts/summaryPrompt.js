const SUMMARY_TYPE_GUIDANCE = {
    brief: 'Focus on the most important outcome in 2-4 short sentences.',
    detailed: 'Provide a fuller summary with context, progression, and important nuances.',
    'bullet-points': 'Summarize the conversation as concise bullet-style key points.',
    'key-decisions': 'Focus on decisions that were made, the rationale, and final agreements.',
    'action-items': 'Focus on tasks, owners if inferable, and follow-up actions.',
};

const SUMMARY_RESPONSE_SCHEMA = `{
"summary": "",
"keyPoints": [],
"actionItems": [],
"decisions": []
}`;

export const buildSummaryPrompt = ({ messages, summaryType = 'brief' }) => {
    const chosenSummaryType = SUMMARY_TYPE_GUIDANCE[summaryType] ? summaryType : 'brief';
    const guidance = SUMMARY_TYPE_GUIDANCE[chosenSummaryType];

    const transcript = messages
        .map((message, index) => {
            const createdAt = message?.createdAt ? new Date(message.createdAt).toISOString() : 'unknown-time';
            const text = String(message?.message || '').trim();
            return `${index + 1}. [${createdAt}] ${text}`;
        })
        .join('\n');

    return [
        {
            role: 'system',
            content: [
                'You are a strict conversation summarizer.',
                'Return ONLY valid JSON.',
                'Do not wrap the JSON in markdown fences.',
                'Do not add explanations, headings, or extra keys.',
                `The response must exactly follow this schema: ${SUMMARY_RESPONSE_SCHEMA}`,
            ].join(' '),
        },
        {
            role: 'user',
            content: [
                `Summary type: ${chosenSummaryType}`,
                `Summary instructions: ${guidance}`,
                'Summarize only the messages provided below. Do not use any outside context and do not summarize anything beyond these messages.',
                'Messages:',
                transcript || 'No messages were provided.',
                'Return ONLY valid JSON matching the schema exactly.',
            ].join('\n'),
        },
    ];
};

export const normalizeSummaryType = (summaryType = 'brief') => {
    return SUMMARY_TYPE_GUIDANCE[summaryType] ? summaryType : 'brief';
};
