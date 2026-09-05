require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());
// Serves agentcart.html (and anything else in this folder) so the frontend
// and backend live on the same origin — no CORS setup needed.
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GROQ_API_KEY;
const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

if (!API_KEY) {
  console.warn('\n⚠️  GROQ_API_KEY is not set.');
  console.warn('   Copy .env.example to .env and add your key before running requests.\n');
}

// Proxies chat requests to Groq's API, keeping the API key server-side only.
// Groq's API is OpenAI-compatible (chat completions format), so we translate
// both the request and the response to/from the shape agentcart.html expects.
app.post('/api/chat', async (req, res) => {
  try {
    const { system, messages } = req.body || {};
    if (!messages) {
      return res.status(400).json({ error: 'Request body must include "messages".' });
    }
    if (!API_KEY) {
      return res.status(500).json({ error: 'Server is missing GROQ_API_KEY. See .env.example.' });
    }

    const chatMessages = [
      ...(system ? [{ role: 'system', content: system }] : []),
      ...messages
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1000,
        messages: chatMessages
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    // Translate Groq's { choices: [{ message: { content } }] } shape into the
    // { content: [{ type: "text", text }] } shape agentcart.html already parses,
    // so the frontend code doesn't need to change.
    const text = data.choices?.[0]?.message?.content || '';
    res.json({ content: [{ type: 'text', text }] });
  } catch (err) {
    console.error('Error calling Groq API:', err);
    res.status(500).json({ error: err.message || 'Unexpected server error' });
  }
});

app.listen(PORT, () => {
  console.log(`\n✅ AgentCart backend running at http://localhost:${PORT}`);
  console.log(`   Open http://localhost:${PORT}/agentcart.html in your browser\n`);
});
