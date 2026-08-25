require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());
// Serves agentcart.html (and anything else in this folder) so the frontend
// and backend live on the same origin — no CORS setup needed.
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.warn('\n⚠️  ANTHROPIC_API_KEY is not set.');
  console.warn('   Copy .env.example to .env and add your key before running requests.\n');
}

// Proxies chat requests to Anthropic, keeping the API key server-side only.
app.post('/api/chat', async (req, res) => {
  try {
    const { system, messages } = req.body || {};
    if (!messages) {
      return res.status(400).json({ error: 'Request body must include "messages".' });
    }
    if (!API_KEY) {
      return res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY. See .env.example.' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system,
        messages
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }
    res.json(data);
  } catch (err) {
    console.error('Error calling Anthropic API:', err);
    res.status(500).json({ error: err.message || 'Unexpected server error' });
  }
});

app.listen(PORT, () => {
  console.log(`\n✅ AgentCart backend running at http://localhost:${PORT}`);
  console.log(`   Open http://localhost:${PORT}/agentcart.html in your browser\n`);
});
