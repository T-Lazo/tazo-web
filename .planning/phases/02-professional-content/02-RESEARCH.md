# Phase 2: Professional Content - Research

**Researched:** 2026-02-23
**Domain:** Next.js component authoring, Tailwind CSS v4 utilities, static content data patterns
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**About section structure**
- Three stacked glass card sections within the About tab: Bio, Experience, Education
- No sub-tabs — all sections are visible by scrolling
- Each section has its own clearly headed glass card, consistent with the existing visual system

**Bio card**
- Claude's discretion on length and tone — aim for a concise but personal portfolio bio (not a full CV paragraph, not a one-liner)
- Source from the CV profile but optimise for portfolio context (someone browsing, not hiring)
- Skill tags embedded at the bottom of the bio card as unsorted pill tags (chocolate-tinted glass style)
- Skill tags: Claude's discretion on which to include — primarily software/tech-focused, but a couple of personality-relevant ones are fine if they fit naturally

**Experience section**
- Timeline layout with a left accent line
- One entry only: Analog Devices | Software Engineering Intern | Summer–Winter 2025
- Bullet points: lift all 4 bullets directly from CV (ADRV906x bring-up, embedded Linux, technical documentation, SSH/UART/remote Linux workflow)
- No other work roles (SEC, Volcano Sushi, Discovery Trails are excluded)

**Education section**
- Same timeline layout as Experience
- Two entries: UL BSc/MSc Immersive Software Engineering + Leaving Certificate at Castletroy College
- Detail level: institution + qualification + year + score only (no subject breakdowns, no project descriptions)

**Projects tab**
- Two project cards: Pi-hole Network Ad Blocker + this portfolio site
- Card structure: title + description + tech tags + status badge (consistent with existing card component)
- Pi-hole: no external link for now (write-up planned but not yet written — link deferred)
- Portfolio: no GitHub link — the live running site is the showcase
- Tech tags per card: Claude's discretion based on actual technologies used

### Claude's Discretion
- Bio text length and exact wording (concise, personal, portfolio-appropriate)
- Which specific skills appear in the tag row (software/tech focus, a couple personality ones OK)
- Tech tag content for each project card
- Exact timeline spacing, accent line colour, and typographic hierarchy within cards

### Deferred Ideas (OUT OF SCOPE)
- Pi-hole write-up: user likes the idea of a short GitHub README/write-up that the project card can link to. Not ready yet — add link to Pi-hole card in a future update once write-up exists.
- Linux Mouse Driver: excluded for now (user not confident explaining it — too much AI involvement). Could be revisited if user revisits the project.
- Non-tech skills (SolidWorks, video editing, phone repair): not in the skills tag row. These belong in Phase 3 Interests & Memories.
- PC Assembly: hardware hobby, not a software project. Excluded from Projects tab.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CONTENT-01 | Refine the "About" section using professional data from TJ_Lazo_CV.md (Experience, Education). | About.tsx must be replaced with a three-card stacked layout (Bio, Experience timeline, Education timeline) using the existing `.glass` utility class. |
| CONTENT-02 | Update the "Projects" section with specific project details and technologies from the CV. | Projects.tsx must be updated with real Pi-hole and portfolio data, tech tag arrays, status badges, and no external links. |
</phase_requirements>

---

## Summary

Phase 2 is a content-and-presentation refactor with no new library dependencies. The visual system (glassmorphism, colour tokens, typography) is fully established in Phase 1. The work is: (1) rewrite `About.tsx` to render three stacked glass cards with a bio+skills section, an experience timeline, and an education timeline; (2) update `Projects.tsx` with real project data, tech tag arrays, and a status badge — removing the placeholder "Future Project" entry.

All design tokens needed (`--color-chocolate`, `--color-beige`, `--color-earth-medium`, `--color-earth-cream`, `.glass` utility) are already defined in `src/app/globals.css`. No npm install step is required. The timeline pattern (left border accent line, dot marker) is a pure Tailwind CSS v4 construction using `border-l`, `border-chocolate/40`, and `w-2 h-2 rounded-full bg-chocolate` for the dot.

The highest-risk execution detail is getting the About tab layout right: the component currently renders a single glass card wrapping a `<p>` tag. It must be restructured to three distinct `<section>` cards stacked vertically with appropriate spacing, while the parent `TabbedInterface.tsx` content wrapper (`min-h-[400px]`) accommodates the taller scroll area without changes.

**Primary recommendation:** Rewrite `About.tsx` and update `Projects.tsx` in two separate plan tasks. Keep all content data as typed constants at the top of each component file — no external data layer needed.

---

## Standard Stack

### Core (already installed — no new packages)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.0.10 | React framework, file-based routing | Project stack — locked |
| Tailwind CSS | v4 (`^4`) | Utility-first styling | Project stack — `.glass` and all colour tokens defined here |
| TypeScript | `^5` | Type-safe component props | Project stack — all `.tsx` files |
| React | 19.2.1 | Component rendering | Project stack |
| Framer Motion | `^12.23.26` | Already in `TabbedInterface.tsx` for tab transitions | Phase 4 will use more; don't add animations in this phase |

### Supporting (already installed)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | `^0.561.0` | Icons (ExternalLink, Github already imported in Projects.tsx) | Remove ExternalLink usage in Phase 2 — no card links. Only keep if a new icon is needed for timeline dots (none needed). |
| clsx | `^2.1.1` | Conditional class composition | Use for status badge variant classes if needed |
| tailwind-merge | `^3.4.0` | Merge conflicting Tailwind classes | Use in a `cn()` helper if repeated class merging needed |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Static typed constants in component | External JSON file or CMS | Overkill for 2 projects and 3 cards; REQUIREMENTS.md explicitly rules out CMS |
| Tailwind border-l for timeline | Custom SVG line | Tailwind approach is simpler, no extra markup, consistent with existing patterns |
| Inline skill tags | Separate SkillTag component | Separate component adds indirection for a simple pill; keep inline for now |

**Installation:** No new packages needed.

---

## Architecture Patterns

### Recommended File Structure After Phase 2

```
src/
├── app/
│   ├── globals.css       # Unchanged — .glass utility already defined
│   ├── layout.tsx        # Unchanged
│   └── page.tsx          # Unchanged
└── components/
    ├── About.tsx          # REWRITE — three stacked glass cards
    ├── Projects.tsx       # UPDATE — real data, tech tags, status badge
    ├── Hero.tsx           # Unchanged
    ├── Socials.tsx        # Unchanged
    └── TabbedInterface.tsx  # Unchanged
```

No new component files are needed. Both modifications are self-contained.

### Pattern 1: Three-Card Stacked About Layout

**What:** Replace the single glass card in `About.tsx` with three vertically stacked `<section>` elements, each wrapped in the `.glass` utility class.

**When to use:** When a tab's content has clearly delineated sub-sections that should be visually separated but all visible on scroll (no sub-tabs).

**Example:**

```tsx
// About.tsx — structural skeleton
export default function About() {
  return (
    <div className="flex flex-col gap-6">
      {/* Card 1: Bio */}
      <section className="glass rounded-3xl p-8 md:p-10">
        <h2 className="text-xl font-serif font-bold text-white mb-4">About</h2>
        <p className="text-beige leading-relaxed">
          {/* portfolio bio text — see Content Data section */}
        </p>
        {/* Skill pills row */}
        <div className="flex flex-wrap gap-2 mt-6">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 rounded-full text-sm bg-chocolate/20 text-beige border border-chocolate/30"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Card 2: Experience */}
      <section className="glass rounded-3xl p-8 md:p-10">
        <h2 className="text-xl font-serif font-bold text-white mb-6">Experience</h2>
        <TimelineList items={experience} />
      </section>

      {/* Card 3: Education */}
      <section className="glass rounded-3xl p-8 md:p-10">
        <h2 className="text-xl font-serif font-bold text-white mb-6">Education</h2>
        <TimelineList items={education} />
      </section>
    </div>
  );
}
```

### Pattern 2: Timeline Entry (Left Accent Line + Dot Marker)

**What:** Pure Tailwind layout for a vertical timeline. A left border on the container provides the accent line. Each entry has a dot marker absolutely positioned against the border.

**When to use:** Any ordered list of dated professional events where chronology should be visually scannable.

**Example:**

```tsx
// Inline — no separate component needed for 1-2 entries
// The border-l sits on the container; each entry is pl-6 relative.
// Dot: absolute -left-[5px] (half the dot width) to sit on the border.

// Timeline container:
<div className="border-l-2 border-chocolate/40 flex flex-col gap-8 pl-6">
  {items.map((item) => (
    <div key={item.org} className="relative">
      {/* Dot marker */}
      <span className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-chocolate border-2 border-earth-deep" />

      {/* Entry header */}
      <div className="flex flex-col gap-0.5 mb-3">
        <p className="text-white font-semibold">{item.org}</p>
        <p className="text-earth-medium text-sm">{item.role}</p>
        <p className="text-earth-medium text-sm">{item.period}</p>
      </div>

      {/* Bullet list (Experience only) */}
      {item.bullets && (
        <ul className="list-disc list-inside space-y-1 text-beige text-sm leading-relaxed">
          {item.bullets.map((b) => <li key={b}>{b}</li>)}
        </ul>
      )}
    </div>
  ))}
</div>
```

Note on dot positioning: `border-l-2` is 2px. The container has `pl-6` (24px left padding). The dot is `w-3 h-3` (12px). To centre the dot on the border, use `-left-[29px]`: 24px padding + 2px border + half dot (6px) ≈ `-left-[29px]`. Adjust if spacing feels off — this is precise enough to start.

### Pattern 3: Projects Card with Tech Tags

**What:** Update the existing `Projects.tsx` data array to include a `tags: string[]` field and render pill tags below the description, above the status badge. Remove `ExternalLink` icon usage.

**When to use:** Any project card where tech stack visibility is a requirement.

**Example:**

```tsx
// Projects.tsx — updated card body
const projects: Project[] = [
  {
    title: "Pi-hole Network Ad Blocker",
    description: "...",
    tags: ["Raspberry Pi", "Linux", "DNS", "Tailscale", "WireGuard"],
    status: "Live",
    statusVariant: "active",
  },
  {
    title: "Portfolio Site",
    description: "...",
    tags: ["Next.js", "Tailwind CSS v4", "TypeScript", "Framer Motion"],
    status: "In Progress",
    statusVariant: "active",
  },
];

// Card body:
<div className="flex flex-wrap gap-2 mb-4">
  {project.tags.map((tag) => (
    <span
      key={tag}
      className="px-2.5 py-0.5 rounded-full text-xs bg-chocolate/20 text-beige border border-chocolate/30"
    >
      {tag}
    </span>
  ))}
</div>
```

Note: The existing status badge style `bg-chocolate/20 text-beige border border-chocolate/30` is already in `Projects.tsx` — use the same tokens for tech tags to maintain visual consistency.

### Anti-Patterns to Avoid

- **Importing data from a separate JSON/TS file:** Keep content constants at the top of each component file. An external data module adds indirection without benefit for 2 components with static content.
- **Adding `"use client"` to About.tsx unnecessarily:** About.tsx is currently a Server Component (no `"use client"` directive). Keep it that way — no interactivity needed in this phase. Only TabbedInterface needs the client directive.
- **Using absolute heights on the timeline container:** Don't set a fixed `h-` on the timeline. Let it grow with content. The `TabbedInterface` wrapper uses `min-h-[400px]` which is a floor, not a ceiling.
- **Animating in this phase:** Phase 4 handles Framer Motion animations. Don't add `motion.div` wrappers or stagger effects in Phase 2 — that work belongs to Phase 4 and adding it now couples the phases.
- **Removing the `ExternalLink` import without checking:** `lucide-react` is imported in `Projects.tsx`. After removing the `ExternalLink` usage, remove the import too to keep the file clean. Verify with a build.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Conditional class merging for badge variants | Custom ternary string concatenation everywhere | `clsx` (already installed) | Clean, readable, handles undefined gracefully |
| Timeline dot positioning | SVG element or pseudo-element via custom CSS | Tailwind `absolute` + negative left offset | Already within the Tailwind v4 paradigm; no new CSS needed |
| "Skill pill" component | Separate reusable component | Inline `<span>` with Tailwind classes | 1 use site; abstraction costs more than it saves |

**Key insight:** This phase is content, not infrastructure. The entire visual system exists. The task is writing the right text and arranging it with Tailwind utilities — not building new abstractions.

---

## Content Data

This section gives the executor the exact content to use, drawn directly from `TJ_Lazo_CV.md` and `02-CONTEXT.md`.

### Bio Text (Claude's discretion — recommendation)

```
Software engineering student at the University of Limerick, recently back from a 6-month internship at Analog Devices. I build things end to end — from Raspberry Pi network setups to this site. I like figuring out how things actually work.
```

Tone note: Conversational, first person, no CV-speak. Signals curiosity and independence without overselling.

### Skill Tags (Claude's discretion — recommendation)

Ordered by relevance to a software engineering audience. Unsorted means no strict alphabetical order; group by feel.

```ts
const skills = [
  "Python", "Java", "C", "Bash",
  "Embedded Linux", "Git", "Docker",
  "SSH", "Networking", "DNS",
  "Raspberry Pi", "Technical Docs",
  "Curious by nature",
];
```

Note: "Curious by nature" is the one personality tag that fits naturally and is honest. Omit SolidWorks, video editing, phone repair (deferred to Phase 3).

### Experience Data (verbatim from CV)

```ts
const experience = [
  {
    org: "Analog Devices",
    role: "Software Engineering Intern",
    period: "Summer 2025 – Winter 2025",
    bullets: [
      "Worked on the Samana project, contributing to the software bring-up of the ADRV906x, a System on Chip (SoC) designed for 5G radio unit development, using a dedicated evaluation board called Denali.",
      "Gained hands-on experience with embedded Linux, modifying configuration files that describe how the operating system interacts with hardware, then building and flashing updated software images onto the board.",
      "Wrote clear technical documentation for low-level hardware tasks, such as controlling onboard components and configuring network interfaces directly through software.",
      "Worked across SSH, UART serial terminals (Tera Term), and remote Linux build environments daily, navigating a professional embedded systems development workflow.",
    ],
  },
];
```

### Education Data (institution + qualification + year + score only)

```ts
const education = [
  {
    org: "University of Limerick",
    role: "BSc/MSc in Immersive Software Engineering",
    period: "2024 – 2028",
    score: "QCA 3.20 / 4.00",
  },
  {
    org: "Castletroy College, Limerick",
    role: "Leaving Certificate",
    period: "2024",
    score: "567 / 625 points",
  },
];
```

No subject breakdowns. Score displayed inline after year, or as a subdued secondary line.

### Projects Data

```ts
const projects = [
  {
    title: "Pi-hole Network Ad Blocker",
    description: "Deployed Pi-hole on a Raspberry Pi Zero 2W to route all home network DNS through a custom blocklist — ad-free and malicious domain protection across every device. Extended with Tailscale (WireGuard VPN) so the same protection follows me on any network, anywhere.",
    tags: ["Raspberry Pi", "Linux", "DNS", "Pi-hole", "Tailscale", "WireGuard", "Networking"],
    status: "Live",
  },
  {
    title: "Portfolio Site",
    description: "The site you're looking at. Built with Next.js and Tailwind CSS v4 on an Earth Deep glassmorphism design system. Animations coming in a future update.",
    tags: ["Next.js", "Tailwind CSS v4", "TypeScript", "Framer Motion"],
    status: "In Progress",
  },
];
```

Note from CONTEXT.md specifics: Pi-hole description should convey the depth (DNS routing, VPN, network security mindset) without inflating scope. "The site you're looking at" framing is explicitly preferred.

---

## Common Pitfalls

### Pitfall 1: Timeline Dot Clipping

**What goes wrong:** The dot marker (absolutely positioned) gets clipped by the parent card's `overflow-hidden` if one is set, or by `rounded-3xl` on the glass card if `overflow: hidden` is implied.

**Why it happens:** `rounded-3xl` in browsers doesn't imply `overflow: hidden` unless explicitly set, but some reset styles or future CSS additions might. Also, the dot is positioned to the left of the `border-l` container, which itself is inside the glass card — the dot needs to protrude slightly left of the timeline container.

**How to avoid:** Ensure the timeline container (the `border-l` div) has `pl-6` padding and the glass card has at least `pl-8` or `px-8`, so the dot sits inside the card's padded area and never protrudes outside the card boundary. The dot should be at approximately `left: -6px` relative to the border line, which means the card padding absorbs it.

**Warning signs:** Dot appears cut off or invisible at the left edge.

### Pitfall 2: TabbedInterface min-h Constraint

**What goes wrong:** Adding three stacked cards to the About tab creates a much taller content area than the original single card. The `min-h-[400px]` on the TabbedInterface content wrapper is a floor, not a ceiling, so this is not a bug — but if the reviewer tests at minimum height it may look wrong.

**Why it happens:** The wrapper uses `min-h`, so taller content just pushes it naturally. No change needed to `TabbedInterface.tsx`. Confirmed by reading the source.

**How to avoid:** Do not change `TabbedInterface.tsx`. The layout handles this correctly.

**Warning signs:** If content is being cut off, check for an accidental `max-h` or `overflow-hidden` on the content wrapper.

### Pitfall 3: Stale ExternalLink Icon Import

**What goes wrong:** `Projects.tsx` currently imports `ExternalLink` from `lucide-react`. After removing the icon from the cards (no external links in Phase 2), the unused import will trigger a TypeScript/ESLint warning in `next build`.

**Why it happens:** The original placeholder used `ExternalLink` conditionally. After data update, no card has `type === "active"` that triggers the icon render — but the import stays.

**How to avoid:** Remove the `lucide-react` import entirely if no icons are used in the updated component. Or keep `Github` if it is used. Verify with `npm run build` after the task.

**Warning signs:** ESLint error `'ExternalLink' is defined but never used` in build output.

### Pitfall 4: Bio Text Age Reference

**What goes wrong:** The current `About.tsx` says "I'm a 19 year old" — hardcoded. The CV Profile says "First year BSc/MSc student". The bio should not hardcode age.

**Why it happens:** Original placeholder wrote the bio casually.

**How to avoid:** Write the new bio without an age reference. Use role/context ("software engineering student at UL") instead.

**Warning signs:** Bio text that will become stale within a year.

---

## Code Examples

Verified patterns from the existing codebase:

### Existing .glass Utility (from globals.css)

```css
/* src/app/globals.css */
.glass {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  background: rgba(220, 215, 201, 0.08);
  border: 1px solid rgba(220, 215, 201, 0.12);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
}
```

All glass cards use this class unchanged.

### Existing Status Badge Pattern (from Projects.tsx)

```tsx
<div className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-chocolate/20 text-beige border border-chocolate/30">
  {project.status}
</div>
```

Tech tag pills use the same token set — `bg-chocolate/20 text-beige border border-chocolate/30` — but with smaller padding (`px-2.5 py-0.5`) and `text-xs` for visual hierarchy: tags smaller than status badge.

### Existing Colour Tokens (from globals.css @theme)

```
text-white          → #FFFFFF
text-beige          → #DCD7C9
text-chocolate      → #A27B5C
text-earth-medium   → #8C9985
text-earth-cream    → #F5F2EA
bg-chocolate/20     → rgba(162, 123, 92, 0.2)
border-chocolate/30 → rgba(162, 123, 92, 0.3)
border-chocolate/40 → rgba(162, 123, 92, 0.4)  ← use for timeline line
```

---

## State of the Art

| Old Approach | Current Approach | Notes |
|--------------|------------------|-------|
| Tailwind CSS v3 `@layer components` | Tailwind CSS v4 `@theme inline` + plain CSS class | `globals.css` already uses v4 syntax — `.glass` is defined as a plain CSS class, not a Tailwind component layer |
| Tailwind v3 `theme()` function | CSS custom properties `var(--color-*)` | All colour tokens are CSS vars; use Tailwind class names (e.g. `text-beige`) not `theme()` function |

**Current pattern for colour tokens in Tailwind v4:** Define in `@theme inline {}` block (already done), use as `text-{name}`, `bg-{name}`, `border-{name}` Tailwind classes. Do not use `theme()` function or `@apply`.

---

## Open Questions

1. **Timeline dot horizontal position needs visual testing**
   - What we know: The math for `-left-[29px]` is derived from `pl-6` (24px) + 2px border + 6px (half of 12px dot). The glass card uses `p-8` (32px) padding, so the dot at 24px from the timeline border sits at 32px - 24px = 8px from the card edge — inside the card.
   - What's unclear: Exact rendering across screen sizes without a live browser check.
   - Recommendation: Implement with the calculated values, verify visually in `npm run dev`, and adjust offset by 1-2px if needed. Not a blocker for planning.

2. **Education score display position**
   - What we know: User wants "institution + qualification + year + score only." Two natural placements: score on same line as period, or as a fourth subdued line below.
   - What's unclear: Which reads better at the card's text size.
   - Recommendation: Claude's discretion — display score as a subdued `text-earth-medium text-sm` line beneath the period. Keeps the entry scannable.

---

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection — `src/app/globals.css`, `src/components/About.tsx`, `src/components/Projects.tsx`, `src/components/TabbedInterface.tsx`, `src/app/layout.tsx` — all read and verified 2026-02-23
- `package.json` — exact versions of all installed packages confirmed
- `TJ_Lazo_CV.md` — source of truth for all content data
- `02-CONTEXT.md` — locked user decisions governing scope

### Secondary (MEDIUM confidence)
- Tailwind CSS v4 `@theme inline` pattern — observed working in `globals.css`; consistent with Tailwind v4 docs pattern for CSS-first configuration

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages confirmed in package.json; no new dependencies
- Architecture: HIGH — component structure read directly from source; patterns derived from existing Phase 1 code
- Content data: HIGH — lifted verbatim from TJ_Lazo_CV.md and 02-CONTEXT.md
- Pitfalls: MEDIUM — derived from code reading and known Tailwind layout patterns; visual confirmation requires browser

**Research date:** 2026-02-23
**Valid until:** 2026-03-23 (stable stack; 30 days reasonable)
