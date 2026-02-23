# Phase 2: Professional Content - Context

**Gathered:** 2026-02-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Populate the portfolio with accurate professional data from TJ_Lazo_CV.md. This means filling the existing About tab (bio, experience, education) and Projects tab (project cards) with real content. The site structure and visual system already exist from Phase 1; this phase is content and presentation decisions only.

</domain>

<decisions>
## Implementation Decisions

### About section structure
- Three stacked glass card sections within the About tab: Bio, Experience, Education
- No sub-tabs — all sections are visible by scrolling
- Each section has its own clearly headed glass card, consistent with the existing visual system

### Bio card
- Claude's discretion on length and tone — aim for a concise but personal portfolio bio (not a full CV paragraph, not a one-liner)
- Source from the CV profile but optimise for portfolio context (someone browsing, not hiring)
- Skill tags embedded at the bottom of the bio card as unsorted pill tags (chocolate-tinted glass style)
- Skill tags: Claude's discretion on which to include — primarily software/tech-focused, but a couple of personality-relevant ones are fine if they fit naturally

### Experience section
- Timeline layout with a left accent line
- One entry only: Analog Devices | Software Engineering Intern | Summer–Winter 2025
- Bullet points: lift all 4 bullets directly from CV (ADRV906x bring-up, embedded Linux, technical documentation, SSH/UART/remote Linux workflow)
- No other work roles (SEC, Volcano Sushi, Discovery Trails are excluded)

### Education section
- Same timeline layout as Experience
- Two entries: UL BSc/MSc Immersive Software Engineering + Leaving Certificate at Castletroy College
- Detail level: institution + qualification + year + score only (no subject breakdowns, no project descriptions)

### Projects tab
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

</decisions>

<specifics>
## Specific Ideas

- User is intentionally honest about project scope — Pi-hole and portfolio are the two things they can speak to confidently and are genuinely proud of. Don't inflate descriptions.
- Pi-hole is stronger than it looks: covers DNS routing, Raspberry Pi, Tailscale/WireGuard VPN, Linux, network security mindset. Description should make the depth clear.
- Portfolio card: the story is "the site you're looking at right now" — lean into that. Tech tags: Next.js, Tailwind CSS v4, TypeScript, Framer Motion (Phase 4 will add animations but it's already in the stack).
- User wants the site to convey personality as well as professional competence — bio tone matters. Not stiff CV-speak.

</specifics>

<deferred>
## Deferred Ideas

- Pi-hole write-up: user likes the idea of a short GitHub README/write-up that the project card can link to. Not ready yet — add link to Pi-hole card in a future update once write-up exists.
- Linux Mouse Driver: excluded for now (user not confident explaining it — too much AI involvement). Could be revisited if user revisits the project.
- Non-tech skills (SolidWorks, video editing, phone repair): not in the skills tag row. These belong in Phase 3 Interests & Memories.
- PC Assembly: hardware hobby, not a software project. Excluded from Projects tab.

</deferred>

---

*Phase: 02-professional-content*
*Context gathered: 2026-02-23*
