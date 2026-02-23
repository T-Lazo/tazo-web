# Feature Landscape

**Domain:** Personal Portfolio Website
**Researched:** February 2026

## Table Stakes

Features users expect in a modern developer portfolio.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Responsive Design | Essential for mobile/tablet viewing. | Low | Tailwind v4 handles this natively. |
| Project Showcase | Core purpose of the site. | Medium | Needs high-quality imagery/links. |
| Contact/Social Links | How users reach out. | Low | Lucide icons for visual clarity. |
| Fast Load Times | Essential for professional impressions. | Medium | Use Next.js Image optimization. |

## Differentiators

Features that set this portfolio apart (per TJ Lazo's vision).

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Earth Deep Palette | Unique, calming aesthetic vs standard black/white. | Low | Focused on hex `#152E24`. |
| Glassmorphism | Provides depth and modern "premium" feel. | Medium | Requires careful contrast handling. |
| Framer Motion 12 | Fluid, natural feeling transitions and reveals. | Medium | Focus on `whileInView` and `staggerChildren`. |
| Interests Section | Humanizes the developer; builds personality. | Low | Focus on Soccer, Video Editing, etc. |

## Anti-Features

Features to explicitly NOT build to maintain minimalism.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Heavy Loaders | Ruins the "minimalist" and "fast" feel. | Use subtle skeleton screens or progressive reveal. |
| Complex CMS | Overkill for a personal site; adds latency. | Keep content in TSX or local JSON/Markdown. |
| Multi-Page Navigation | Breaks the flow of a single-page portfolio. | Use smooth-scroll or tabbed interface (existing). |

## Feature Dependencies

```
Theme (Earth Tones) → Glassmorphism (Needs background contrast)
Glassmorphism → Scroll Animations (Revealing blurred elements)
CV Content → Projects/About Sections
```

## MVP Recommendation

Prioritize:
1. **Thematic Consistency:** Background `#152E24` and beige text across all tabs.
2. **Smooth Transitions:** Simple fade-in/up animations for tab content switching.
3. **Refined About Section:** Incorporate CV data immediately to provide value.

Defer: **Interest Gallery:** Can be added after the core professional sections are polished.

## Sources

- [Personal Portfolio Best Practices (2025/2026)](https://awwwards.com) (General Trends)
- [TJ Lazo Project Requirements](.planning/PROJECT.md)
