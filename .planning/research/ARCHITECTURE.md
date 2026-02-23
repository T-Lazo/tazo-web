# Architecture Patterns

**Domain:** Personal Portfolio Website
**Researched:** February 2026

## Recommended Architecture

A **Single Page Application (SPA)** architecture using Next.js App Router. The site relies on a central "Layout" that manages the background and main branding, with a "Tabbed Interface" for content switching.

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `Layout` | Global background (#152E24), noise texture, typography. | All Children |
| `Hero` | Branding, initial impression, name, and tagline. | None |
| `TabbedInterface` | State management for content (About/Projects/Socials). | `TabContent` |
| `GlassPanel` | Reusable wrapper for glassmorphic elements. | Any child content |

### Data Flow

- **Static Content:** CV data and project info should be stored in a `data/` directory as TypeScript constants for maximum performance and type safety.
- **State:** React `useState` for tab switching; Framer Motion for visual state transitions.

## Patterns to Follow

### Pattern 1: Declarative Animations
**What:** Use Framer Motion's `AnimatePresence` and `motion` components to define animations within the component itself.
**When:** Tab switching or element reveals.
**Example:**
```typescript
<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
  >
    {content}
  </motion.div>
</AnimatePresence>
```

### Pattern 2: Glassmorphic Composition
**What:** Creating a reusable `Glass` component that applies `backdrop-blur` and a semi-transparent border.
**Why:** Ensures consistency in the "glass" look across the site.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Hardcoding Colors
**What:** Spreading hex codes like `#152E24` throughout the codebase.
**Why bad:** Makes theme adjustments (e.g., darkening for contrast) difficult.
**Instead:** Define them in Tailwind v4 `@theme` and use `bg-earth-deep`.

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 1M users |
|---------|--------------|--------------|-------------|
| Hosting | Vercel Free | Vercel Pro | CDN Cache (Edge) |
| Performance | Client-side | Static Export | Static Export + Edge |

## Sources

- [Next.js App Router Architecture](https://nextjs.org/docs/app/building-your-application/routing)
- [Framer Motion Component Patterns](https://www.framer.com/motion/component-patterns/)
