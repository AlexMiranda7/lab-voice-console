// netlify/functions/slack-send.js
exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const MAKE_WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL;
        
        if (!MAKE_WEBHOOK_URL) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'MAKE webhook not configured' })
            };
        }

        let payload;
        const contentType = event.headers['content-type'] || '';
        
        if (contentType.includes('application/json')) {
            payload = JSON.parse(event.body);
        } else {
            const params = new URLSearchParams(event.body);
            payload = {};
            for (const [key, value] of params) {
                payload[key] = value;
            }
        }

        payload.source = 'lab-studio-voice-console';
        payload.timestamp = payload.timestamp || new Date().toISOString();

        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: true, message: "Forwarded to MAKE router" })
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};