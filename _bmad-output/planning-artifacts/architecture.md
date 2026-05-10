---
stepsCompleted:
  - step-01-init
  - step-02-context
  - step-03-starter
  - step-04-decisions
  - step-05-patterns
  - step-06-structure
  - step-07-validation
  - step-08-complete
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - versoin 3 (HTML source)
workflowType: architecture
---

# Architecture — Maurice Speak Buttons

**Author:** Maurice (Architect Agent)
**Date:** 2026-05-10
**Version:** 1.0

---

## Context & Goals

Convert the single-file `versoin 3` HTML app into a fully tested, maintainable React SPA deployed on GitHub Pages. All logic must be portable, testable in jsdom, and deployable as a static bundle.

---

## Technology Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | React 19 | Already scaffolded; hooks model suits the stateful UI |
| Bundler | Vite 8 | Fast HMR, native ESM, simple GitHub Pages base config |
| Test runner | Vitest | Native Vite integration; jest-compatible API |
| Test utilities | React Testing Library + jsdom | Component testing without impl coupling |
| State management | React `useState` / `useReducer` in `App` | Local state only; no global store needed |
| Persistence | `localStorage` via `useLocalStorage` hook | Zero-backend requirement; atomic JSON |
| Styling | Single `index.css` (CSS custom properties) | Matches versoin 3 aesthetic; no CSS-in-JS overhead |
| Linting | ESLint (already scaffolded) | Enforced in CI |
| Deploy | GitHub Actions → `gh-pages` branch | Standard static deploy pattern |

---

## Repository Layout

```
Maurice_buttons123/
├── .agents/skills/            ← BMAD skills (42 skills for github-copilot)
├── .github/
│   └── workflows/
│       ├── ci.yml             ← lint + test + build on push/PR
│       └── deploy.yml         ← build + deploy to gh-pages on main push
├── _bmad/                     ← BMAD config/scripts
├── _bmad-output/
│   ├── planning-artifacts/
│   │   ├── prd.md
│   │   └── architecture.md
│   └── implementation-artifacts/
│       └── epics-and-stories.md
├── docs/                      ← project knowledge
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx               ← ReactDOM.createRoot entry
│   ├── index.css              ← global dark-theme styles
│   ├── App.jsx                ← root component, global state
│   ├── utils/
│   │   ├── color.js           ← contrastTextColor(hex)
│   │   ├── speech.js          ← speakSegment, speakText, speakBothSequential, speakBothSimultaneous, splitIntoPhrases
│   │   └── voices.js          ← buildVoiceOptions(voices, lang), SIMULATED_HEBREW_VARIANTS
│   ├── hooks/
│   │   ├── useLocalStorage.js ← generic JSON localStorage hook
│   │   ├── useVoices.js       ← speechSynthesis.getVoices() + onvoiceschanged
│   │   └── useButtons.js      ← CRUD + persist on top of useLocalStorage
│   ├── components/
│   │   ├── CreatePanel.jsx    ← add-new-button form
│   │   ├── ButtonCard.jsx     ← single saved button card
│   │   ├── ButtonsGrid.jsx    ← responsive grid of ButtonCard
│   │   ├── EditModal.jsx      ← modal to edit an existing button
│   │   └── VoicesDebug.jsx    ← collapsible voices list panel
│   └── __tests__/
│       ├── color.test.js
│       ├── speech.test.js
│       ├── voices.test.js
│       ├── useLocalStorage.test.js
│       ├── ButtonCard.test.jsx
│       ├── CreatePanel.test.jsx
│       ├── EditModal.test.jsx
│       └── App.test.jsx
├── index.html
├── vite.config.js
├── package.json
└── eslint.config.js
```

---

## Component Architecture

```
App
 ├── state: buttons[], realisticMode, realisticIntensity, previewInfo
 ├── hooks: useButtons, useVoices
 ├── CreatePanel
 │    ├── state: form fields (text, lang, voiceURI, color, altText, altLang, altVoiceURI, altColor)
 │    ├── props: voices, onAdd(buttonObj), onPreview(text, lang, voiceURI)
 │    └── VoicesDebug (collapsible, voices prop)
 ├── ButtonsGrid
 │    └── ButtonCard × N
 │         ├── props: button, voices, realisticMode, realisticIntensity, onEdit, onDelete
 │         └── calls: speakText, speakBothSequential, speakBothSimultaneous
 └── EditModal (conditional render)
      ├── props: button, voices, onSave(updatedButton), onClose
      └── state: local copy of button fields
```

---

## Data Model

```js
// Button object stored in localStorage array
{
  id: string,         // random 7-char base-36 uid
  text: string,       // primary text
  lang: string,       // 'en-US' | 'he-IL'
  voiceURI: string,   // voice URI or 'SIM:deep|bright|slow|fast'
  color: string,      // hex e.g. '#7c3aed'
  altText: string,    // optional alternate text
  altLang: string,    // '' | 'en-US' | 'he-IL'
  altVoiceURI: string,
  altColor: string,
}
```

---

## Key Patterns

### useLocalStorage Hook
```
useLocalStorage(key, initialValue)
  → [value, setValue]
  reads on mount, writes on every setValue call
  try/catch around both read and write
  returns initialValue if JSON.parse fails or quota exceeded
```

### useVoices Hook
```
useVoices()
  → SpeechSynthesisVoice[]
  calls getVoices() on mount
  subscribes to speechSynthesis.onvoiceschanged
  returns [] in non-browser envs (SSR/test safety)
```

### useButtons Hook
```
useButtons()
  → { buttons, addButton, updateButton, deleteButton }
  wraps useLocalStorage('customSpeakButtons_v1_realistic_color', [])
  addButton: generates uid, pushes, saves
  updateButton: maps over array replacing matching id
  deleteButton: filters out matching id
```

### Speech utilities (speech.js)
```
splitIntoPhrases(text) → string[]
  splits on [.!?] then [,;:]

speakSegment(segment, lang, voiceURI, pitch, rate, cancelExisting) → Promise<void>
  creates SpeechSynthesisUtterance
  picks voice: voiceURI match → lang prefix → name /hebrew/ → first
  resolves on onend

speakText(text, lang, voiceURI, { realistic, intensity }) → Promise<void>
  non-realistic: single speakSegment call
  realistic: forEach phrase → speakSegment with jitter → inter-phrase pause

speakBothSequential(p, pl, pv, a, al, av) → Promise<void>
speakBothSimultaneous(p, pl, pv, a, al, av) → void
```

---

## GitHub Actions Workflows

### CI (`ci.yml`) — triggers on push + PR to any branch
```
steps:
  1. checkout
  2. setup-node 22 + cache npm
  3. npm ci
  4. npm run lint
  5. npm test -- --run   (Vitest in CI mode)
  6. npm run build
```

### Deploy (`deploy.yml`) — triggers on push to `main` only
```
steps:
  1. checkout
  2. setup-node 22 + cache npm
  3. npm ci
  4. npm run build
  5. peaceiris/actions-gh-pages@v4
       github_token: secrets.GITHUB_TOKEN
       publish_dir: ./dist
```

---

## Vite Configuration

```js
// vite.config.js
base: '/Maurice_buttons123/'   // must match GitHub repo name for Pages asset paths
```

---

## Testing Strategy

| Layer | Tool | What is tested |
|---|---|---|
| Pure utils | Vitest | `contrastTextColor`, `splitIntoPhrases`, `buildVoiceOptions` |
| Hooks | Vitest + renderHook | `useLocalStorage` read/write/error handling |
| Components | Vitest + RTL | Render, user interactions, aria roles |
| Integration | RTL + App | Add button → appears in grid; delete → removed; edit → updated |
| Speech | Vitest + vi.stubGlobal | `speakText` calls correct SpeechSynthesisUtterance properties |

All tests run in jsdom. `speechSynthesis` is mocked via `vi.stubGlobal`.
