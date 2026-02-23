# Domain Pitfalls: Portfolio & Glassmorphism

**Domain:** Personal Portfolio / UI Design
**Researched:** February 2026

## Critical Pitfalls

### Pitfall 1: The "Blur Lag" (Performance)
**What goes wrong:** Excessive use of `backdrop-blur` on large elements causes stuttering during scroll, especially on mobile or high-refresh-rate displays.
**Why it happens:** Backdrop blurs are computationally expensive for the GPU as they require sampling pixels from the layers behind.
**Prevention:** 
- Limit blurs to smaller panels or headers.
- Use `backdrop-blur-md` (12px-16px) instead of `3xl` where possible.
- Use `will-change: transform` on animated blurred elements.

### Pitfall 2: Contrast & Accessibility
**What goes wrong:** Light beige text on a glass panel that is over a slightly lighter background becomes unreadable.
**Why it happens:** Glassmorphism reduces the contrast ratio between foreground and background.
**Prevention:** 
- Ensure the "Earth Deep" background is dark enough.
- Add a subtle `bg-black/20` overlay inside glass panels to darken the area behind text.
- Test with WCAG contrast checkers.

## Moderate Pitfalls

### Pitfall 1: Next.js "Flicker" on Refresh
**What goes wrong:** Content flashes or shifts layout when the page loads.
**Why it happens:** Framer Motion `initial` states and SSR sometimes conflict if not handled correctly.
**Prevention:** 
- Ensure `AnimatePresence` is used correctly.
- Use `opacity: 0` in CSS for the initial state if possible to prevent layout shift before hydration.

### Pitfall 2: Over-Animation
**What goes wrong:** Every element flying in from different directions makes the site feel "cheap" or overwhelming.
**Prevention:** 
- Use a consistent "Reveal" pattern (e.g., subtle fade + 10px slide up).
- Stagger children animations so they feel like a wave rather than a chaotic explosion.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Theme Setup | Color muddying | Use OKLCH in Tailwind v4 to ensure colors remain vibrant even when darkened. |
| Animations | Janky Scroll | Use `whileInView` with `once: true` to prevent animations re-triggering constantly. |
| Glassmorphism | Border "Sharpness" | Use very low opacity borders (`border-white/10`) to avoid a "boxed" look. |

## Sources

- [Performance of CSS Backdrop-Filter](https://web.dev/articles/backdrop-filter)
- [Accessibility in Glassmorphism](https://uxdesign.cc/glassmorphism-and-accessibility-9442657e84)
