# AgentCart — Local Backend

This is a minimal Express server that lets AgentCart run fully standalone on your machine,
outside of Claude's artifact environment. It keeps your Anthropic API key on the server
(never exposed in browser JS) and proxies requests to Anthropic on the frontend's behalf.

## Setup

1. **Install Node.js 18+** if you don't have it (check with `node -v`).

2. **Install dependencies** — in this folder, run:
   ```
   npm install
   ```

3. **Add your API key** — copy `.env.example` to a new file named `.env`, then paste in
   your key from [console.anthropic.com](https://console.anthropic.com):
   ```
   ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx
   PORT=3000
   ```

4. **Start the server**:
   ```
   npm start
   ```
   You should see:
   ```
   ✅ AgentCart backend running at http://localhost:3000
      Open http://localhost:3000/agentcart.html in your browser
   ```

5. **Open the app** — go to `http://localhost:3000/agentcart.html` in your browser.
   "Run agent" will now work end-to-end.

## How it works

- `agentcart.html`'s frontend code calls `/api/chat` (relative path — same origin, no CORS needed)
  instead of calling `api.anthropic.com` directly.
- `server.js` receives that request, attaches your `ANTHROPIC_API_KEY` server-side, and forwards
  it to the real Anthropic API.
- Your key never touches the browser or gets exposed in page source — this is the same pattern
  any production app uses to call an LLM API safely from a client.

## Notes

- `.env` is git-ignored — never commit your real API key to GitHub.
- If you deploy this (e.g. to Render, Railway, Vercel), set `ANTHROPIC_API_KEY` as an environment
  variable in that platform's dashboard rather than committing a `.env` file.
