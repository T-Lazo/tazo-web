# Codebase Structure

## Root
- `next.config.ts`: Next.js configuration.
- `tsconfig.json`: TypeScript configuration.

## Source (`src/`)
- `app/`: App Router pages and layouts.
  - `page.tsx`: Main entry point.
  - `layout.tsx`: Root layout.
  - `globals.css`: Global styles.
- `components/`: Reusable UI components.
  - `Hero.tsx`: Hero section.
  - `TabbedInterface.tsx`: Main interactive tab container.
  - `About.tsx`, `Projects.tsx`, `Socials.tsx`: Tab content components.
