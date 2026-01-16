# flashcard - AI Coding Instructions

This project is an offline-first flashcard PWA built with **Alpine.js**, **Web Components**, **Tailwind CSS v4**, and **IndexedDB**.

## Tech Stack & Architecture

- **State Management:** [Alpine.js](https://alpinejs.dev/) using a global store (`Alpine.store("app")`).
- **Components:** Light-DOM [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) (Custom Elements) defined in `src/components/*.ts`.
- **Persistence:** IndexedDB via `StorageService` in `src/storage.ts`.
- **Build Tool:** Vite with TypeScript.
- **Styling:** Tailwind CSS v4 (inline utilities in component templates).

## Key Patterns & Conventions

### 1. Global State Orchestration (Alpine Store)
The source of truth for the application state lives in `src/main.ts` under `Alpine.store("app")`.
- **Internal Reference:** Use `this` within store methods (typed via `AppStore` interface in `src/main.ts`).
- **Template Reference:** Access via `$store.app`.
- **Responsibility:** The store handles dataset selection, study progress, and persistence calls. Components should call store methods (e.g., `$store.app.markCorrect()`) rather than calling `storageService` directly.

### 2. Light-DOM Web Components
Components are native Custom Elements but **do not use Shadow DOM**. This allows Tailwind CSS v4 global styles and utilities to reach the elements.
- **Pattern:** Class extending `HTMLElement`, setting `this.innerHTML` in `connectedCallback`.
- **Reactivity:** Alpine.js directives (`x-text`, `@click`, `x-show`) are used within the `innerHTML` string.
- **Example:** See `src/components/flash-card.ts`.

### 3. Storage & Data Flow
- **Service:** All IndexedDB interactions MUST go through `storageService` in `src/storage.ts`.
- **Schema:**
  - `Dataset`: Contains `id`, `name`, `columns` (array of header names), and `items`.
  - `CardItem`: Contains `id`, `values` (a `Record<string, string>` mapped to column names), and stats (`correctCount`, `wrongCount`).
- **PWA:** Service worker handles offline caching in `public/sw.js`.

### 4. Component Splitting
Logic should be compartmentalized into focused components:
- `dataset-list`: Management and selection.
- `upload-dataset`: CSV parsing and importing.
- `study-panel`: Study flow orchestration.
- `flash-card`: Visual representation and flip animation.

## Developer Workflow

- **Development:** `npm run dev` (Vite)
- **Type Checking:** `npx tsc`
- **Build:** `npm run build` (TSC + Vite build)

## CSS & Styling
- Avoid custom CSS; use **Tailwind CSS v4** utility classes directly in `innerHTML`.
- For complex animations (like card flips), use arbitrary values or Tailwind transform utilities (e.g., `[transform-style:preserve-3d]`).
