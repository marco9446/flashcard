## Plan: Offline Flashcard Study App with Progress Tracking

This plan implements a simple, offline-first flashcard web app using Alpine.js for state management, IndexedDB for persistent storage, and a light-DOM native Web Component for card logic. Users can import datasets, track their learning progress (Correct/Wrong), and study in multiple modes.

Architecture goal:

- Keep the project as **compartmentalized** as possible.
- Prefer small, focused **web components** that each contain their own UI + logic (similar to `flash-card`), and keep shared concerns (storage, CSV parsing, app state) in dedicated modules.

Key requirements reflected here:

- CSV first line contains **column names** (e.g., `italian,german`) and those names must be stored per dataset and **associated to each row**.
- Card click can **flip/rotate** for the animation, but the text must remain **readable** (not mirrored / not rotated 180°). The flip should effectively “swap” which column value is shown.

### Steps

1. **IndexedDB Service**

   - Create/update [src/storage.ts](src/storage.ts) to manage datasets and learning statistics (correct/wrong counts per word pair).
   - Extend the dataset schema to include column names from the CSV header and store per-row data in a way that keeps the column names associated with the row (see “Storage Schema” below).
   - Keep this as a pure service module (no DOM/UI).

2. **App State**

   - Define `Alpine.store('app')` in [src/main.ts](src/main.ts) to handle dataset selection, study modes (all vs. failed only), and current card progress.
   - Track “revealed” state for the current card (instead of “flipped”), controlling when the second column text and the feedback buttons appear.
   - Keep the store focused on orchestration; UI components should call store actions rather than duplicating persistence logic.

3. **UI Components (Compartmentalized)**

   - Create small, focused web components under [src/components/](src/components/) where each component owns its UI + interaction logic.
   - Recommended component split:
     - `flash-card` (card interaction + visual flip)
     - `dataset-import` (textarea + validation + submit)
     - `dataset-list` (render list + select/delete actions)
     - `study-panel` (study controls + progress + correct/wrong actions)
   - Keep layout/composition in [index.html](index.html), but minimize inline logic there where components can own it.

4. **Card Component (Flip Animation, Readable Text)**

   - Refactor [src/components/flash-card.ts](src/components/flash-card.ts) as a light-DOM component to allow standard Tailwind styling.
   - Implement a flip interaction that swaps the visible value:
     - Initial view shows the prompt column text (e.g., `italian`).
     - Clicking the card flips and shows the answer column text (e.g., `german`).
     - The displayed text must be upright/readable (not mirrored). Recommended approach: two faces (`.card-front`, `.card-back`) with `backface-visibility: hidden`, and rotate the back face by 180° so it reads correctly when the container is flipped.
   - Ensure the component can display the dataset’s column labels (optional but recommended) alongside the values.

5. **Data Management (CSV Header + Row Association)**

   - Implement CSV parsing as a reusable helper module (recommended: `src/csv.ts`) instead of embedding parsing logic directly in HTML.
   - Parsing rules:
     - **Line 1 = header** (two column names)
     - Remaining lines = rows
   - When saving a dataset:
     - Store the parsed column names at the dataset level.
     - Store each row such that the two texts remain explicitly tied to the column names (not just positional “A/B” without context).

6. **Study & Feedback UI**

   - Implement the study UI primarily in a dedicated component (recommended: `study-panel`) that consumes the Alpine store.
   - Ensure:
     - Clicking the card flips and shows the answer (readable/upright).
     - “Correct” and “Wrong” buttons appear only after reveal.
     - Buttons update IndexedDB stats via the Alpine store for the current row/card.

7. **Offline Support**
   - Set up `public/manifest.json` and `public/sw.js` with a stale-while-revalidate strategy for reliable offline access.

### Storage Schema (Updated)

Store datasets with explicit column-name support, and ensure each row keeps column names associated with the text.

- **Dataset**

  - `id`, `name`, `createdAt`, …
  - `columns: [string, string]` (e.g., `["italian","german"]`)
  - `items: Array<CardItem>`

- **CardItem** (row)
  - `id`
  - `values: Record<string, string>` (e.g., `{ "italian": "ciao", "german": "hallo" }`)
  - `correctCount`, `wrongCount`

### Further Considerations

1. **UI Labels**

   - Consider showing column labels in the card (e.g., “italian” above the prompt, “german” above the revealed answer) to reduce ambiguity when datasets vary.

2. **Reveal Behavior**

   - Decide whether clicking again hides the answer (“toggle reveal”) or reveal is one-way until the user answers (recommendation: one-way reveal until Correct/Wrong to keep flow predictable).

3. **Review Logic**

   - Should “failed words” mode prioritize highest failure rate? (Recommendation: start with a simple filter: any card with `wrongCount > 0`.)

4. **CSV Constraints**
   - Confirm scope: exactly two columns per dataset. If more columns are desired later, the `values` map supports it, but UI/study rules must define which columns are prompt/answer.
