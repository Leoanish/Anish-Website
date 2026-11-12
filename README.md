# Anish Website

## Live website

**[View Anish Bhattarai's live portfolio →](https://anish-bhattarai.leoanish9.chatgpt.site/)**

A modern, responsive research portfolio for Anish Bhattarai. The site turns a traditional academic CV into an exploratory web experience and includes a privacy-friendly, locally grounded “Ask Anish” assistant.

## Structure

- `dist/index.html` — portfolio content and accessible page structure
- `dist/styles.css` — visual system, layouts, motion, and responsive behavior
- `dist/app.js` — navigation, filters, and the CV-grounded question-answering experience
- `dist/assets/` — portrait and downloadable CV

## Content sources

The initial content is curated from `Anish_Bhattarai_CV_2026.pdf`. Personal interests, sports teams, players, and additional project stories will be added only after Anish confirms what he wants to publish.

## Run locally

Serve `dist/` with any static server, for example:

```bash
python3 -m http.server 4173 --directory dist
```
