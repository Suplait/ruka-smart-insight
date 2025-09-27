# Repository Guidelines

## Project Structure & Module Organization
The app is a Vite + React + TypeScript project. UI code lives in `src`, with route-level pages under `src/pages`, reusable UI in `src/components`, hooks in `src/hooks`, and data access helpers in `src/services` and `src/integrations`. Shared types stay in `src/types` and utilities in `src/utils`. Static assets come from `public`. Supabase Edge Functions are tracked in `supabase/functions`, and infrastructure settings (migrations, project config) sit in `supabase`. Tailwind, ESLint, and Vite configs remain at the repo root.

## Build, Test, and Development Commands
Run `npm install` before hacking; align with the committed `package-lock.json`. `npm run dev` starts the Vite dev server with hot reload. `npm run build` creates a production bundle, while `npm run build:dev` emits a development-mode build used for staging previews. `npm run preview` serves a prebuilt bundle locally. `npm run lint` enforces TypeScript + React lint rules and should pass before opening a pull request.

## Coding Style & Naming Conventions
Use modern React function components and hooks. Keep files in PascalCase for components (`ProductShowcase.tsx`) and camelCase for utilities. Favor TypeScript types over interfaces unless extending. Tailwind utility classes drive styling; colocate component-specific styles via `cn` helpers rather than new CSS files. Follow the ESLint configuration (`eslint.config.js`); it enforces React Hooks rules and Vite-friendly exports. Prefer named exports, and keep modules focused.

## Testing Guidelines
Automated tests are not yet configured, so validate changes manually in the dev server, covering Supabase-backed flows and responsive layouts. When introducing tests, add Vitest + React Testing Library under `src/__tests__` using `*.test.tsx` filenames and target 80% line coverage. Include minimal fixtures alongside the spec. Document any new manual QA steps in the pull request.

## Commit & Pull Request Guidelines
Commits follow concise, imperative subjects (`Refactor ProductShowcase component`, `Fix video background`). Group related changes and avoid noisy chores. For pull requests, include: overview of the change, screenshots or GIFs for UI updates, Supabase migration notes when relevant, and links to Jira/issues. Confirm lint/build status and outline manual test steps so reviewers can reproduce them quickly.

## Supabase & Environment Tips
Environment secrets (e.g., `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) belong in a local `.env`. Sync Edge Functions via `supabase/functions` and run `supabase login` followed by `supabase functions deploy <name>` when promoting. Keep migrations in sync before merging to prevent drift.
