# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common commands

### Install deps
```sh
npm install
```

### Run the app (dev)
```sh
npm run dev
```

### Production build / start
```sh
npm run build
npm run start
```

### Lint
```sh
npm run lint
```

### Typecheck (no dedicated script)
TypeScript is configured with `noEmit: true` in `tsconfig.json`, so a standalone typecheck can be run via:
```sh
npx tsc -p tsconfig.json
```

### Tests
No test runner is currently configured (no `test` script in `package.json`, and no Jest/Vitest/Playwright/Cypress config present). If tests are added, document the chosen runner and “run single test” command here.

## High-level architecture

### Framework / entrypoints
- This is a **Next.js App Router** project.
- Route entrypoints live under `src/app/`.
  - `src/app/page.tsx`: the `/` route.
  - `src/app/layout.tsx`: root layout (HTML shell + global providers). It imports `src/app/globals.css` and sets `export const metadata`.

### Styling
- Styling uses **Tailwind CSS v4** via PostCSS.
  - `src/app/globals.css` includes `@import "tailwindcss";` and defines CSS variables/theme tokens.
  - PostCSS is configured in `postcss.config.mjs` using `@tailwindcss/postcss`.

### Static assets
- `public/` is the Next.js static assets directory (served from `/`). Example usage appears in `src/app/page.tsx` via `/next.svg`.

### Module resolution conventions
- TypeScript path alias `@/*` maps to `src/*` (see `tsconfig.json`), so imports can use `@/…` instead of relative paths.

### Lint configuration
- ESLint uses the **flat config** format in `eslint.config.mjs`, composed from `eslint-config-next` presets:
  - `core-web-vitals`
  - `typescript`
- Build outputs like `.next/**` are ignored in the lint config.

### Environment variables
- `.env*` files are gitignored (see `.gitignore`). If runtime configuration is needed, use local `.env.local` / `.env.development.local` etc., and document any required variable names in `README.md` or here.