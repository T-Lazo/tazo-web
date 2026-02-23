# Technology Stack

**Project:** Tazo Website (Personal Portfolio)
**Researched:** February 2026
**Confidence:** HIGH

## Recommended Stack

### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next.js | 16.0.10 | App Framework | Latest stability for React 19 features, Server Components, and optimized performance. |
| React | 19.2.1 | UI Library | Required for Next.js 16; includes Actions and improved hook handling. |
| TypeScript | 5.x | Type Safety | Industry standard for scalable React applications. |

### Styling & Design
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Tailwind CSS | v4.x | CSS Framework | CSS-first engine, ultra-fast, native support for modern CSS features (OKLCH, backdrop-filters). |
| Framer Motion | 12.x | Animation | Industry leading animation library for React; v12 is optimized for React 19 and includes improved scroll hooks. |
| Lucide React | Latest | Icons | Clean, consistent, and performant SVG icon library. |

### Utility Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `clsx` | ^2.1.1 | Class Merging | Conditionally applying Tailwind classes. |
| `tailwind-merge` | ^3.4.0 | Class Conflict Reso | Handling Tailwind class conflicts in reusable components. |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Styling | Tailwind v4 | CSS Modules | Tailwind provides faster iteration and better ecosystem for glassmorphism utility patterns. |
| Animation | Framer Motion | GSAP | GSAP is powerful but Framer Motion's declarative API fits better with React's component model. |
| Colors | Hex/CSS Vars | Tailwind Config JS | Tailwind v4 moves config to CSS (`@theme`), making JS-based config deprecated/less efficient. |

## Installation

```bash
# Core Dependencies
npm install framer-motion@12 lucide-react clsx tailwind-merge

# Tailwind v4 setup (PostCSS)
npm install -D tailwindcss@4 @tailwindcss/postcss
```

## Implementation Notes: Glassmorphism in v4

In Tailwind v4, glassmorphism should be implemented using CSS variables in the `@theme` block for consistency:

```css
@theme {
  --color-earth-deep: #152E24;
  --color-beige: #DCD7C9;
  --glass-bg: rgba(220, 215, 201, 0.05);
  --glass-border: rgba(220, 215, 201, 0.1);
}

/* Usage in components */
.glass-panel {
  @apply bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] rounded-2xl;
}
```

## Sources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs/v4-beta) (Official)
- [Framer Motion Documentation](https://www.framer.com/motion/) (Official)
- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19) (Official)
