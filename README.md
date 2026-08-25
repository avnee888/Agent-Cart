# AgentCart — Autonomous Shopping Assistant Agent

AgentCart is an AI agent that turns a plain-language shopping request into a completed purchase decision — no filters, no scrolling, no comparison spreadsheets. Tell it what you need, and it reasons through the trade-offs on its own.

Built for **Razorpay AI Builder Internship 2026 — Track 1: AI Growth & Agentic Commerce**.

## What it does

Give it a goal like *"find me a laptop under ₹60000 for video editing"* and the agent:

1. **Parses your intent** — extracts category, budget, use case, and priorities from your natural-language request
2. **Searches the catalog** — pulls matching products
3. **Compares options** — reasons about which products actually fit your stated need, not just keyword matches
4. **Recommends with explanation** — ranks the top picks and explains *why* each one fits
5. **Checks out autonomously** — completes a (simulated) purchase when you confirm

Every step is visible in a live "agent trace" panel, so you can see the reasoning happen in real time rather than getting a single black-box answer.

## Why this matters for agentic commerce

Most shopping tools stop at search or recommendation. AgentCart demonstrates the next layer: an agent that takes **autonomous action** (completing checkout) based on multi-step reasoning, not just a single LLM call. This is the core pattern behind agentic commerce — agents that act on a user's behalf, not just answer questions.

## Tech stack

- **Frontend**: Vanilla HTML/CSS/JS — no framework overhead for a focused demo
- **LLM**: Claude (Anthropic API) for intent parsing and ranked recommendation reasoning
- **Backend**: Minimal Express server (`server.js`) that proxies API calls, keeping the API key server-side and out of client code
- **Catalog**: A built-in sample product dataset (laptops, smartphones, shoes, tablets, headphones) — swappable in a production setting for a real merchant/product API

## Running it

See [`README.md` setup instructions in the backend folder] or:

```
npm install
cp .env.example .env    # add your Anthropic API key
npm start
```

Then open `http://localhost:3000/agentcart.html`.

## What's simulated vs. real

- **Real**: LLM-driven intent parsing, product ranking, and reasoning — actual Claude API calls
- **Simulated**: The product catalog (local dataset instead of a live inventory API) and checkout (generates a mock order ID rather than processing a real payment)

In production, the catalog and checkout layers would connect to real merchant/product and payment APIs — the agent reasoning logic itself would stay the same.
