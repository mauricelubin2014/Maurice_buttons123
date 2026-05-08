# Colorful Speak Buttons — Dual Speak

A small single-file web app that creates customizable "speak" buttons. Each button can hold a primary text and an alternate text (translation) with independent language and voice settings. Features per-button full-card coloring, simulated Hebrew voice variants, and a "realistic" speaking mode (phrase splitting, slight pauses and pitch/rate variation) to make speech sound more natural.

Live demo
- If published to GitHub Pages the URL will be:
  `https://<your-username>.github.io/<repo-name>/`
  (e.g. `https://mauricelubin2014.github.io/maurice_buttons/`)

Features
- Primary + alternate text per button, each with its own language and voice.
- Play primary, alternate, both sequentially, or attempt simultaneous play.
- Per-button full-card accent color with automatic high-contrast label color.
- "Realistic" speech mode: splits text into phrases, inserts short pauses, and slightly varies pitch/rate for more natural delivery.
- Simulated Hebrew voice variants (deep, bright, slow, fast) when system Hebrew voices are limited.
- Voice-list diagnostic to inspect system-installed TTS voices.
- Saves your buttons locally to localStorage; no server required.

Files
- `index.html` — the entire app. Single-file, drop in a static host or open locally.

Getting started

Prerequisites
- Modern browser with Web Speech API (speechSynthesis):
  - Recommended: Chrome / Edge (desktop), Safari (macOS) for best behavior.
  - Mobile browsers may require a tap/user gesture for audio to work.
- If you need reliable Hebrew pronunciation across platforms, consider using a cloud TTS provider (Azure/Google/AWS) — see notes below.

Run locally (quick)
1. Save `index.html` into a folder.
2. Serve with a lightweight static server (recommended; avoids file:// issues):

   Python 3:
