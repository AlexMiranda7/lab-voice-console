// netlify/functions/slack-proxy.js
exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { targetUrl, payload } = JSON.parse(event.body);
        
        if (!targetUrl || !targetUrl.startsWith('https://hook.')) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid MAKE webhook URL' })
            };
        }

        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.text();
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: true, message: "Forwarded to MAKE" })
        };
    } catch (error) {
        console.error("Proxy error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};