---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
inputDocuments:
  - versoin 3 (HTML source)
  - index_Version1.html
  - index_Version5.html
  - README.md
workflowType: prd
classification:
  projectType: web-app
  domain: accessibility-tools / language-learning
  complexity: medium
  projectContext: brownfield
---

# Product Requirements Document — Maurice Speak Buttons

**Author:** Maurice
**Date:** 2026-05-10
**Version:** 1.0
**Status:** Approved

---

## Executive Summary

Maurice Speak Buttons is a browser-based React web application that lets users create, manage, and activate personalised text-to-speech (TTS) "speak buttons". Each button can hold primary text with a chosen language (English or Hebrew) and an optional alternate translation, both with independent voice and colour settings. The app targets bilingual households, language learners, educators, and accessibility users who need quick one-tap TTS playback with a visually distinctive, colourful card interface.

The application is converted from a single-file HTML/JS prototype (versoin 3) into a fully tested, deployable React app published on GitHub Pages — complete with CI pipelines, persistent local storage, and a proper component architecture.

---

## Product Vision

**Vision Statement:**  
Empower anyone — regardless of technical skill — to create a personal panel of speak-buttons in any supported language, accessible with a single tap, saved automatically, and beautiful enough to stay open on a classroom screen or phone.

**Problem Being Solved:**  
There is no lightweight, zero-install, personalised TTS panel for bilingual users. Existing TTS tools require typing every time, are not bilingual per-button, and are not visually engaging.

**Target Users:**
- Parents / teachers of bilingual children (Hebrew ↔ English)
- Language learners who want quick-fire pronunciation guides
- Accessibility users who pre-programme commonly-spoken phrases
- Developers / tinkerers wanting a customisable TTS playground

---

## Success Criteria

### User Success
- A user can create a speak button in under 30 seconds
- Buttons persist across browser refreshes without any manual save action
- Every button plays speech on first tap with no additional setup
- Users can distinguish buttons at a glance via colours and language badges

### Business / Project Success
- App is deployed to GitHub Pages and publicly accessible
- All CI checks pass (lint + test + build) on every push
- Test coverage covers all utility functions and key component interactions
- Zero runtime errors on first-load in Chrome, Firefox, and Safari

### Technical Success
- Lighthouse performance score ≥ 90
- Bundle size under 200 KB gzipped
- localStorage reads/writes are atomic and handle quota errors gracefully
- Speech synthesis degrades gracefully when the API is unavailable

---

## User Journeys

### Journey 1 — Create a Button
1. User opens the app
2. Types primary text (e.g., "Good morning")
3. Selects language (English) and voice
4. Optionally picks a card colour
5. Optionally types an alternate Hebrew translation and selects its voice/colour
6. Clicks **+ Add Button**
7. Button card appears in the grid immediately
8. On next reload the button is still there

### Journey 2 — Play a Button
1. User sees the button card with the text label
2. Taps **🔊 Play** — primary text is spoken
3. Taps **🔁 Alt** — alternate text is spoken
4. Taps **▶ Both** — primary then alternate spoken sequentially
5. With **Realistic mode** ON the speech sounds more natural (phrase splits, pitch variation)

### Journey 3 — Edit a Button
1. User clicks **Edit** on a card
2. A modal opens (not a browser `prompt()`) pre-filled with current values
3. User changes text, language, voice, colour
4. Clicks **Save** — card updates immediately
5. Changes persisted to localStorage

### Journey 4 — Delete a Button
1. User clicks **Delete** on a card
2. Confirmation dialog appears
3. User confirms — card removed from grid and localStorage

### Journey 5 — Explore Voices
1. User clicks **List Voices**
2. Collapsible panel shows all system voices with lang / name / URI
3. User uses this to find the best voice for their language

---

## Domain Analysis

**Domain:** Accessibility tools / bilingual education aid  
**Compliance:** No PII collected; no server-side storage; entirely client-side  
**Browser API dependency:** Web Speech API (`speechSynthesis`) — graceful degradation required  
**Internationalisation:** RTL text direction for Hebrew inputs; labels in English  

---

## Innovation & Differentiators

- **Full-card colour** — each button is a vivid, user-chosen colour with automatic contrast text
- **Realistic speech mode** — phrase splitting, inter-phrase pauses, and slight pitch/rate jitter
- **Dual-language per button** — primary + alternate text/voice on a single card
- **Simulated Hebrew voice variants** — pitch/rate presets (deep, bright, slow, fast) for environments without a native Hebrew voice
- **Zero-backend** — entirely client-side; works offline after first load (future: PWA)

---

## Project Type

**Type:** Frontend SPA (Single-Page Application)  
**Framework:** React 19 + Vite  
**Deployment:** GitHub Pages (static)  
**Storage:** Browser `localStorage` (no backend)  
**Testing:** Vitest + React Testing Library  
**CI/CD:** GitHub Actions  

---

## Product Scope

### MVP (v1.0 — this release)
- Create, edit, delete speak buttons (primary + optional alternate)
- Language selection: English (en-US) and Hebrew (he-IL)
- Voice selection (filtered by language + simulated Hebrew variants)
- Full-card colour picker (primary + alternate)
- Realistic speech toggle with intensity selector
- Play: primary / alternate / sequential-both / simultaneous-both
- Preview speech before saving
- List all system voices (debug panel)
- localStorage persistence (auto-save / auto-load)
- Edit modal (no browser `prompt()`)
- GitHub Pages deployment
- CI: lint + test + build

### Growth Features (Post-MVP)
- Export / import buttons (JSON file)
- PWA manifest + service worker (offline use)
- More languages (Arabic, Spanish, French…)
- Cloud TTS integration (Azure / Google / AWS) for higher-quality voices
- Drag-and-drop button reordering
- Button categories / folders

### Vision (Future)
- Mobile app wrapper (Capacitor/Electron)
- Multi-user sync (optional cloud account)
- Voice recording as button source
- AI-generated translations

---

## Functional Requirements

### FR-001 — Button Management
- **FR-001-1** User can add a button with: text, language, voice URI, colour
- **FR-001-2** User can add optional alternate: text, language, voice URI, colour
- **FR-001-3** User can edit any field of an existing button via a modal (not `prompt()`)
- **FR-001-4** User can delete a button with confirmation
- **FR-001-5** Button list is persisted to `localStorage` key `customSpeakButtons_v1_realistic_color`

### FR-002 — Speech Playback
- **FR-002-1** Play primary text using selected voice + language
- **FR-002-2** Play alternate text using alternate voice + language
- **FR-002-3** Play primary then alternate sequentially with 200 ms gap
- **FR-002-4** Attempt simultaneous playback of primary + alternate
- **FR-002-5** Realistic mode: split text on sentence/clause boundaries; apply random ±pitch/rate jitter scaled by intensity
- **FR-002-6** Support simulated Hebrew variants via `SIM:deep|bright|slow|fast` voice URI prefix
- **FR-002-7** Graceful fallback: alert user if `speechSynthesis` is unavailable

### FR-003 — Voice Management
- **FR-003-1** Load voices from `speechSynthesis.getVoices()`; refresh on `onvoiceschanged`
- **FR-003-2** Filter voice list: exact lang match → prefix match → name match → others
- **FR-003-3** Append simulated Hebrew variants when lang is `he-*`
- **FR-003-4** Restore previous selection after voice list refresh if URI still present
- **FR-003-5** List-Voices debug panel shows all voices (toggleable)

### FR-004 — UI / UX
- **FR-004-1** Dark theme with gradient background (matches versoin 3 design)
- **FR-004-2** Responsive grid layout for button cards (`auto-fit`, min 220 px)
- **FR-004-3** Full-card background colour with automatic contrast text (luminance formula)
- **FR-004-4** Language badge per card (EN / HE)
- **FR-004-5** RTL input direction when Hebrew language is selected
- **FR-004-6** Button count display
- **FR-004-7** Status/preview info message area (aria-live)

---

## Non-Functional Requirements

### NFR-001 — Performance
- Initial JS bundle ≤ 200 KB gzipped
- Time-to-interactive ≤ 3 s on 4G

### NFR-002 — Reliability
- `localStorage` operations wrapped in try/catch; quota errors surfaced gracefully
- `speechSynthesis` API access gated with feature-detection

### NFR-003 — Accessibility
- All interactive elements reachable via keyboard
- `aria-live` regions for dynamic content
- Colour contrast ≥ 4.5:1 on card text (automatic via luminance helper)

### NFR-004 — Maintainability
- Utility functions (`color.js`, `speech.js`, `voices.js`) are pure and unit-testable
- Component tests via React Testing Library (no implementation detail coupling)
- ESLint + Prettier enforced in CI

### NFR-005 — Deployability
- `vite build` produces a self-contained `dist/` folder
- `base` path in `vite.config.js` matches GitHub Pages repo path `/Maurice_buttons123/`
- GitHub Actions deploy workflow uses `peaceiris/actions-gh-pages`
