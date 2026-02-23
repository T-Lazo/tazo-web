# Phase 1 Context: Visual Identity & Foundation

## Visual Hierarchy & Contrast
- **Primary Text**: White (#FFFFFF) for high contrast and readability.
- **Secondary/Highlight**: Beige for accents and secondary information.
- **Interactions**: Chocolate Brown (#A27B5C or similar) used for hover/active backgrounds to provide a warm, tactile feel.
- **Structural Elements**: Earth Deep (#152E24) or slightly modified dark tones used for subtle dividers.
- **Overall Mood**: "Cozy & Warm" — achieved through the deep green background combined with rich brown and beige highlights.

## Glassmorphic Intensity
- **Blur**: Heavy Blur (20px+) for a premium, frosted look.
- **Opacity**: Semi-Opaque (30-50%) to ensure text readability against the complex background.
- **Borders**: Border-less — rely on subtle shadows and the blur itself for separation.
- **Tinting**: Warm/Earth Tint — the glass layers should have a subtle beige/warm wash rather than being strictly neutral white.

## Layout Density & Spacing
- **Spacing**: Expansive — generous use of whitespace and padding to maintain a minimalist, non-cluttered feel.
- **Width**: Wide Layout (approx. 1200px+) to utilize modern screen real estate while remaining responsive.
- **Corners**: Soft/Organic (16px-24px corner radius) for all containers and interactive elements.
- **Flow**: Continuous Flow — sections should transition smoothly without feeling like disconnected "islands."

## Key Decisions Reference

| Decision | Implementation Note |
|----------|---------------------|
| #152E24 BG | Set as global background in Tailwind v4. |
| White Primary Text | Default text color for the application. |
| Brown Action States | Define in Tailwind theme for buttons/tabs. |
| Heavy Warm Glass | Implement as a reusable component/utility class. |
| Soft Corners | Global utility for containers. |

---
*Created: Mon Feb 23 2026 after Phase 1 Discussion*
