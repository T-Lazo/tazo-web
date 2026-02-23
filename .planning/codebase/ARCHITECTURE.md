# Architecture

## Pattern
- **Framework**: Next.js App Router (Single Page Application feel).
- **Rendering**: Hybrid (Server Components for Layout/Hero, Client Components for interactive Tabs).

## Key Components
- **Layout**: `RootLayout` wraps app with fonts and global styles.
- **Page**: `Home` page acts as the main container.
- **Interactive UI**: `TabbedInterface` manages state for switching views (About, Projects, Socials).

## State Management
- Local React `useState` for UI state (tab selection).
