# Anish Website

## Live website

**[View Anish Bhattarai's live portfolio →](https://leoanish.github.io/Anish-Website/)**

A modern, responsive research portfolio for Anish Bhattarai, hosted on GitHub Pages. It turns a traditional academic CV into an exploratory web experience and includes **Ask Anish**, an AI guide (powered by Groq) that answers visitors' questions about Anish's research, publications, projects, awards, and background.

## Structure

- `dist/index.html` — portfolio content and accessible page structure
- `dist/styles.css` — visual system, layouts, motion, and responsive behavior
- `dist/app.js` — navigation, filters, and the Ask Anish chat (set `CHAT_ENDPOINT` at the top)
- `dist/assets/` — portrait, research images, and downloadable CV
- `worker/worker.js` — the chat proxy: holds the Groq API key and everything the AI knows about Anish
- `.github/workflows/pages.yml` — publishes `dist/` to GitHub Pages on every push to `main`

## One-time setup

### 1. Turn on GitHub Pages

1. GitHub Pages on a free account needs a **public** repository: **Settings → General → Danger Zone → Change visibility → Public**. (Skip this if you have GitHub Pro.)
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Open the **Actions** tab and run **Deploy website to GitHub Pages** (or push any commit to `main`).

The site is then live at <https://leoanish.github.io/Anish-Website/>.

### 2. Turn on the AI chat

A website's code is visible to everyone, so the Groq API key must never be placed in `dist/`. It lives in a small free Cloudflare Worker that sits between the site and Groq.

1. Create a free Groq API key at <https://console.groq.com/keys>.
2. Create a free account at <https://dash.cloudflare.com> → **Workers & Pages → Create → Worker** → name it `ask-anish` → **Deploy**.
3. Click **Edit code**, delete the sample, paste everything from `worker/worker.js`, and click **Deploy**.
4. **Settings → Variables and Secrets → Add** → type **Secret**, name `GROQ_API_KEY`, value = your Groq key → **Deploy**.
5. Copy the Worker URL (looks like `https://ask-anish.<your-name>.workers.dev`) and paste it into the first setting in `dist/app.js`:

   ```js
   const CHAT_ENDPOINT = "https://ask-anish.<your-name>.workers.dev";
   ```

6. Commit and push. Until this is done, the chat still works but answers from short built-in notes instead of the AI.

Optional Worker variables: `GROQ_MODEL` (default `llama-3.3-70b-versatile`) and `ALLOWED_ORIGINS` (comma-separated; default `https://leoanish.github.io`, needed only if the site moves to a custom domain).

## Updating what the AI knows

Edit the `KNOWLEDGE` text near the top of `worker/worker.js` (new paper, award, project, hobbies), then paste the file into the Cloudflare Worker again and deploy. The AI is instructed to answer only from that text, so only put public information there.

Safeguards built into the Worker: only this website can call it, questions are length-limited, each visitor is limited to 20 questions per 10 minutes, and the AI declines off-topic requests.

## Content sources

Content is curated from `Anish_Bhattarai_CV_2026.pdf`, Anish's research overview, and the published abstracts of his papers. Personal interests, sports teams, players, and additional project stories will be added only after Anish confirms what he wants to publish.

## Run locally

Serve `dist/` with any static server, for example:

```bash
python3 -m http.server 4173 --directory dist
```
