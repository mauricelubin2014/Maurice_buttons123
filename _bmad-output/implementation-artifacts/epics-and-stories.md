---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
workflowType: epics-and-stories
---

# Epics & Stories — Maurice Speak Buttons

**Author:** Maurice (SM Agent)
**Date:** 2026-05-10

---

## Epic 1 — Project Setup & Tooling

> Scaffold the React project, configure build tools, add testing infrastructure, and CI/CD pipelines.

### Story 1.1 — Configure Vite base path for GitHub Pages
**As a** developer,  
**I want** `vite.config.js` to set `base: '/Maurice_buttons123/'`,  
**So that** all asset URLs are correct when deployed to GitHub Pages.  
**AC:**
- `vite.config.js` contains `base: '/Maurice_buttons123/'`
- `npm run build` produces `dist/index.html` with assets prefixed `/Maurice_buttons123/`

### Story 1.2 — Install and configure Vitest + RTL
**As a** developer,  
**I want** Vitest and React Testing Library installed with jsdom environment,  
**So that** I can write and run component + unit tests locally and in CI.  
**AC:**
- `vitest`, `@vitest/coverage-v8`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom` in devDependencies
- `vite.config.js` has `test: { environment: 'jsdom', setupFiles: ['./src/setupTests.js'] }`
- `src/setupTests.js` imports `@testing-library/jest-dom`
- `npm test -- --run` exits 0 with at least one passing test

### Story 1.3 — GitHub Actions CI workflow
**As a** developer,  
**I want** a CI workflow that runs lint, test, and build on every push and PR,  
**So that** broken code is caught before merging.  
**AC:**
- `.github/workflows/ci.yml` exists
- Workflow triggers on `push` and `pull_request` for all branches
- Steps: checkout → node 22 → npm ci → lint → test → build
- All steps use correct `npm` commands

### Story 1.4 — GitHub Actions deploy workflow
**As a** project owner,  
**I want** every push to `main` to automatically deploy the built app to GitHub Pages,  
**So that** the live URL at `https://mauricelubin2014.github.io/Maurice_buttons123/` is always up to date.  
**AC:**
- `.github/workflows/deploy.yml` exists
- Triggers on push to `main` only
- Uses `peaceiris/actions-gh-pages@v4`
- Publishes `./dist` directory using `GITHUB_TOKEN`

---

## Epic 2 — Utility Modules

> Pure, testable helper functions extracted from versoin 3 logic.

### Story 2.1 — Color utility (`src/utils/color.js`)
**As a** developer,  
**I want** a `contrastTextColor(hex)` function,  
**So that** button card text is always readable against any background colour.  
**AC:**
- Function exported from `src/utils/color.js`
- Returns `'#000000'` for light colours (luminance > 0.55)
- Returns `'#ffffff'` for dark colours
- Handles missing / invalid hex gracefully (returns `'#000'`)
- Unit tests cover: white, black, mid-grey, versoin-3 defaults (#7c3aed, #0ea5a4)

### Story 2.2 — Voice utilities (`src/utils/voices.js`)
**As a** developer,  
**I want** a `buildVoiceOptions(voices, lang)` function and `SIMULATED_HEBREW_VARIANTS` constant,  
**So that** voice dropdown options are built consistently across form and card components.  
**AC:**
- `SIMULATED_HEBREW_VARIANTS` array exported with keys: deep, bright, slow, fast
- `buildVoiceOptions(voices, lang)` returns array of `{ value, label }` objects
- Ordering: exact lang match → prefix match → hebrew name match → others
- Appends simulated variants when lang starts with `he`
- Restores previous selection logic tested
- Unit tests cover: empty voices, en-US filter, he-IL with simulated variants

### Story 2.3 — Speech utilities (`src/utils/speech.js`)
**As a** developer,  
**I want** `splitIntoPhrases`, `speakSegment`, `speakText`, `speakBothSequential`, `speakBothSimultaneous` exported,  
**So that** speech logic is reusable and independently testable.  
**AC:**
- All 5 functions exported
- `splitIntoPhrases('Hello. World, friend')` → `['Hello', 'World', 'friend']`
- `speakText` calls `speechSynthesis.speak` with correct lang and voice
- `speakText` with realistic=true splits and calls speak multiple times
- `speakBothSequential` resolves primary before starting alternate
- All tested with `speechSynthesis` mocked via `vi.stubGlobal`

---

## Epic 3 — Custom Hooks

> React hooks encapsulating state and side-effect logic.

### Story 3.1 — `useLocalStorage` hook (`src/hooks/useLocalStorage.js`)
**As a** developer,  
**I want** a generic `useLocalStorage(key, initialValue)` hook,  
**So that** any component can persist state across page loads without boilerplate.  
**AC:**
- Returns `[value, setValue]` tuple
- Reads from localStorage on mount; falls back to `initialValue` on parse error
- `setValue` writes JSON to localStorage
- Wraps both in try/catch; logs errors without throwing
- Tests cover: read initial, update value, handle corrupt JSON, missing localStorage

### Story 3.2 — `useVoices` hook (`src/hooks/useVoices.js`)
**As a** developer,  
**I want** a `useVoices()` hook that returns available `SpeechSynthesisVoice[]`,  
**So that** voice lists stay in sync when the browser loads voices asynchronously.  
**AC:**
- Calls `speechSynthesis.getVoices()` on mount
- Subscribes to `speechSynthesis.onvoiceschanged` and updates state
- Returns `[]` when `speechSynthesis` is not available (test/SSR safety)
- Cleanup removes the event listener on unmount

### Story 3.3 — `useButtons` hook (`src/hooks/useButtons.js`)
**As a** developer,  
**I want** `useButtons()` returning `{ buttons, addButton, updateButton, deleteButton }`,  
**So that** all button CRUD + localStorage persistence is centralised.  
**AC:**
- Backed by `useLocalStorage` with key `customSpeakButtons_v1_realistic_color`
- `addButton(fields)` generates uid and appends
- `updateButton(id, fields)` merges fields into matching button
- `deleteButton(id)` filters out matching button
- All operations immediately reflected in returned `buttons` array

---

## Epic 4 — Components

> React components implementing the full UI from versoin 3.

### Story 4.1 — `VoicesDebug` component
**As a** user,  
**I want** a toggleable panel that lists all available system voices,  
**So that** I can find the correct voice URI for my language.  
**AC:**
- Toggle button labelled "List Voices"
- Panel hidden by default; shown/hidden on toggle
- Lists each voice as `{lang} | {name} | {voiceURI}`
- "No voices available yet" message when list is empty

### Story 4.2 — `CreatePanel` component
**As a** user,  
**I want** a form to configure and add a new speak button,  
**So that** I can set text, language, voice, colour for both primary and alternate.  
**AC:**
- Inputs: primary text, language select, voice select, colour picker
- Inputs: alternate text, alternate language select, alternate voice select, alternate colour picker
- Realistic mode checkbox + intensity select
- Buttons: **+ Add Button**, **Play Preview (primary)**, **Play Preview (both)**, **List Voices**
- Voice dropdowns re-populate when language changes
- RTL direction on text input when Hebrew selected
- Enter key in primary or alternate text field triggers add
- Calls `onAdd(buttonObj)` with complete button object
- Calls `onPreview(text, lang, voiceURI)` for preview buttons
- `previewInfo` status text shown in aria-live region
- Form clears primary + alternate text after add

### Story 4.3 — `ButtonCard` component
**As a** user,  
**I want** each saved button displayed as a colourful card with play/edit/delete controls,  
**So that** I can play speech or manage each button with a single tap.  
**AC:**
- Card background = `button.color`; text colour from `contrastTextColor`
- Primary text label (RTL when Hebrew)
- Language badge (EN / HE)
- Alternate text shown if present (with `⇄` prefix, RTL when Hebrew)
- Buttons: **🔊 Play**, **🔁 Alt**, **▶ Both (seq)**, **🔊🔊 Both (sim)**, **Edit**, **Delete**, colour swatch
- Play calls `speakText` with button's primary settings
- Alt play calls `speakText` with button's alternate settings
- Both-seq calls `speakBothSequential`
- Both-sim calls `speakBothSimultaneous`
- Edit fires `onEdit(button.id)`
- Delete fires `onDelete(button.id)` after confirmation

### Story 4.4 — `ButtonsGrid` component
**As a** user,  
**I want** all saved buttons shown in a responsive grid,  
**So that** I can see and access all my buttons at once.  
**AC:**
- Renders `ButtonCard` for each button
- Shows count: "N button(s)"
- `aria-live="polite"` on grid container
- Empty state: "No buttons yet. Add one above."

### Story 4.5 — `EditModal` component
**As a** user,  
**I want** a proper modal (not a browser prompt) to edit a button's fields,  
**So that** I can update any field including voice and colour.  
**AC:**
- Opens when `button` prop is truthy
- Pre-fills all fields from the button object
- Fields: primary text, lang, voice, colour; alternate text, lang, voice, colour
- **Save** calls `onSave(updatedButton)` and closes
- **Cancel** closes without saving
- Pressing Escape closes without saving
- Focus trapped inside modal when open
- Accessible: role="dialog", aria-modal, aria-labelledby

### Story 4.6 — `App` root component
**As a** developer,  
**I want** `App.jsx` to wire all state, hooks, and components together,  
**So that** the app works as a complete, cohesive whole.  
**AC:**
- Uses `useButtons` for CRUD
- Uses `useVoices` for voice list
- `realisticMode` and `realisticIntensity` state passed down to `CreatePanel` and `ButtonCard`
- `editingButton` state controls `EditModal` visibility
- `onEdit` handler sets `editingButton`; `onSave` calls `updateButton`; `onDelete` calls `deleteButton` with confirm
- `onPreview` calls `speakText`
- Layout matches versoin 3: header, create panel, buttons grid, footer

---

## Epic 5 — Styling

### Story 5.1 — Global dark theme CSS
**As a** user,  
**I want** the app to match the versoin 3 dark aesthetic,  
**So that** the look and feel is preserved in the React conversion.  
**AC:**
- `src/index.css` defines: dark gradient body, panel cards, button styles (.btn-primary, .btn-ghost, .btn-small), grid layout, btn-card full-card styling, responsive breakpoints
- CSS custom property `--muted: #94a3b8`
- All versoin 3 class names preserved or mapped to equivalent React className usage

---

## Epic 6 — Integration Tests

### Story 6.1 — Full add-edit-delete integration test
**As a** developer,  
**I want** an integration test that exercises the full add → edit → delete flow in `App`,  
**So that** regressions in the core user journey are caught automatically.  
**AC:**
- Test renders `<App />`
- Types text, clicks Add, verifies card appears
- Clicks Edit, changes text, saves, verifies updated card
- Clicks Delete, confirms, verifies card removed
- localStorage mock used (no real browser storage needed)
