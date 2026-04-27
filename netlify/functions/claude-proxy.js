// netlify/functions/claude-proxy.js
exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const API_KEY = process.env.ANTHROPIC_API_KEY;
        
        if (!API_KEY) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' })
            };
        }

        const { systemPrompt, userMessage } = JSON.parse(event.body);

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5',
                max_tokens: 1500,
                system: systemPrompt,
                messages: [{ role: 'user', content: userMessage }]
            })
        });

        const data = await response.json();
        
        return {
            statusCode: response.status,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error("Claude proxy error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};