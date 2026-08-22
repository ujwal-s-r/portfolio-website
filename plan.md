# Portfolio Website — Build Specification

**Owner:** Ujwal
**Role framing:** AI/ML Engineer & Data Engineer (applied AI, moving toward systems/kernel engineering)
**Stack:** Next.js (App Router) + TailwindCSS, deployed on Vercel
**Design philosophy:** Content-first, engineer-built, not designer-built. No decorative animation for its own sake. Every "dynamic" element must either convey information or make content easier to scan. Bold typography and restrained color carry the visual identity — not particles, gradients, or 3D scenes.

---

## 1. Global Design System

### Colors
- Background: `#0a0a0a` (off-black, not pure `#000`)
- Primary text: `#f0f0f0` (soft off-white, not pure white)
- Secondary/muted text: `#9a9a9a`
- Accent (single color, used sparingly — hover states, active nav, tags, timeline dots, links): warm amber `#e0a03c` OR muted red-orange `#c1443c` (pick one, stay consistent everywhere)
- Card surface: `#141414` with a 1px border `#232323`
- No gradients. No glow/blur effects. No neon.

### Typography
- Large, bold display type for the hero headline (variable weight, tight tracking) — this is the primary visual anchor of the site, replacing any 3D/graphic centerpiece.
- Clean sans-serif for body (e.g. Inter, Geist, or similar).
- Monospace font reserved for: tags, tech-stack labels, code snippets, dates in timeline — gives an engineering texture without overusing it.

### Motion rules
- No ambient background animation (no particles, no neural mesh, no floating drift).
- Motion only on: hover (subtle scale-up, ~1.03–1.05x), click (card-to-overlay expand transition), and scroll-triggered fade/slide-in of sections (simple, fast, no scroll-jacking).
- All hover/expand transitions should feel snappy (150–250ms), not slow/cinematic.

### Content architecture (critical for maintainability)
Every repeatable content type must be data-driven, not hardcoded into components:
- `/content/projects/*.mdx` — one file per project
- `/content/research/*.mdx` — one file per paper implementation
- `/content/learning/*.mdx` — one file per "currently learning" item
- `/content/labs/*.mdx` or `*.json` — one entry per embedded interactive experiment (like the GPU Three.js page)
- `/content/experience.json` — array of experience entries
- `/content/blog/*.mdx` — optional future blog posts
- `/content/skills.json` — array of skill logos/names for the auto-scroll strip

Adding new content later = adding one new file to the relevant folder. No component code changes required. This is a hard requirement — build the components to map over these content collections.

---

## 2. Page Structure (top to bottom)

### 2.1 Top Navigation (sticky)
- Left or right cluster: social icons — GitHub, LinkedIn, X/Twitter (if used), Email
- Right: "Resume" button — opens/downloads PDF resume, visually distinct (outlined or filled button, uses accent color)
- Transparent/background-matching, stays fixed on scroll, minimal height

### 2.2 Hero Section (first viewport, split layout)

**Layout: 35–40% left / 60–65% right, roughly full viewport height**

**Left column (35–40%):**
- Short intro/brief block at top: "Hi, I'm Ujwal — AI/ML & Data Engineer" + 2–3 line brief (who you are, what you build, what you're moving toward — e.g. applied AI → systems/kernel engineering)
- Below the brief: **Experience chain** — vertical timeline of 3 entries (most recent first), connected by a vertical line with dot markers
  - Each experience = a rectangular card: company, role, dates, 1-line summary
  - Hover: slight magnify (scale ~1.03) to signal interactivity
  - Click: opens an overlay/modal — large, centered, small padding on all sides (background dimmed, not covered), content fully **Markdown-rendered** (role details, responsibilities, impact, tech used), close button top-right of overlay
  - No scroll needed in this list (only 3 items — fixed height fits)

**Right column (60–65%): Projects**
- Loose staggered/masonry grid (not a rigid uniform grid, not physically drifting/floating — settled, staggered layout for visual interest without motion)
- Each project card: header image/thumbnail, project name as the dominant text on the card, 1-line description visible by default
- Hover: card magnifies slightly + reveals a short summary overlay on the image
- Click: expands into a large overlay — occupies most of the screen with small padding on left/right/top, background dimmed but visible/static, overlay content scrolls internally, close button
  - Overlay content structure: header image → project title → short explanation (resume-length, not essay-length) → tech stack tags → results/findings (can include an image/chart) → links (repo/live demo)
  - Content rendered from Markdown/MDX per project file

**Bottom-right sub-section (within/just below the hero's right column): Research Paper Implementations**
- Same card-and-overlay interaction pattern as projects, but visually distinguished as a separate row/sub-section (e.g. a divider label "Research Implementations" or "From Scratch") sitting below the main project grid, still within the right-side column
- Cards should highlight: paper name, what was implemented (e.g. "Transformer — built from scratch, no HF libraries"), link to repo
- Rationale for separating from Projects: this signals a distinct skill (translating research into working code) that would get diluted if mixed into general project cards — keep it a clearly labeled, compact section rather than a separate full page

---

### 2.3 Currently Learning + Embedded Labs Section (revealed on scroll, next full section after hero)

**Layout within this section's viewport: top ~30% / bottom ~70% split**

**Top 30%: "Currently Learning" cards**
- Horizontal row of cards (same visual language as project cards — hover-magnify, click-to-expand overlay)
- Each card: topic name (e.g. "LLMs from Scratch," "Reinforcement Learning," "CUDA Kernels"), short status line ("in progress" / "not started yet" / "actively building"), 1-line description
- Click opens overlay with more detail: what you're doing, resources/roadmap, links to any related repo/notes — Markdown-rendered like other overlays

**Bottom 70%: Embedded Interactive Labs**
- For experiments like your GPU-expansion Three.js page: embed the actual interactive page (iframe or direct component mount) directly in this section, not just a screenshot or description
- Each embedded lab has a title/caption above or below it and an **"Open Full"** button that links out to the standalone full-control version of that page
- Multiple labs stack vertically (or in cards if you have several) — same card treatment (subtle hover state) applies to the containers holding each embed
- This section is designed to directly showcase hands-on systems/GPU work, not just describe it

---

### 2.4 Skills Section (below Learning section)
- Auto-scrolling horizontal logo strip (marquee-style, continuous loop, grayscale/muted logos so they don't compete with the accent color)
- Tech logos only (PyTorch, CUDA, Spark, Airflow, Kubernetes, etc.) — no vague text tags
- Pause on hover (standard marquee UX)

### 2.5 GitHub Section
- GitHub contribution graph (fetched via GitHub API or a contribution-graph-generator service, live/auto-updating — not a static screenshot)
- Pinned repos: pulled via GitHub REST API so new pinned repos show automatically without manual edits — small repo cards (name, description, stars, primary language)
- Link to full GitHub profile

### 2.6 LinkedIn Highlights Section
- Note: LinkedIn has no public embed API for personal post feeds (unlike YouTube) — do NOT attempt a live embed
- Approach: static screenshot cards of 2–3 best posts, each card links out to the actual LinkedIn post when clicked
- Include a clear "Connect on LinkedIn" CTA alongside

### 2.7 Blog / Learning Notes Section (optional, future-friendly)
- List of blog post cards (title, date, 1-line summary), pulled from `/content/blog/*.mdx`
- Click opens the full Markdown-rendered post (either inline overlay or dedicated route — dedicated route `/blog/[slug]` is fine here since blog posts benefit from being shareable individual URLs)
- This section should require zero component changes to add new posts — just drop a new `.mdx` file

### 2.8 Contact / Footer
- Direct email (mailto or simple contact form)
- Repeat of social links
- Resume button repeated here
- Simple, no clutter

---

## 3. Interaction Pattern Reference (applies to Experience, Projects, Research, Currently Learning cards — one consistent system)
1. **Default state:** static card in its grid/timeline position, no motion
2. **Hover:** scale up slightly (~1.03–1.05x), maybe a subtle border/accent highlight, cursor signals clickability
3. **Click:** card expands into a large overlay
   - Background dims (does not disappear) and stays static
   - Overlay occupies most of the screen with small padding on left/right/top (per your spec — not full-bleed)
   - Overlay content is internally scrollable if it exceeds viewport height
   - Content is Markdown/MDX-rendered (title, header image, body text, tags, result images, links)
   - Close button clearly visible (top-right of overlay)
4. Use the same overlay component across all card types — only the content schema differs. This keeps the codebase small and consistent.

---

## 4. Content You'll Need to Prepare (data entry, not design)
- 3 experience entries (company, role, dates, summary, full Markdown description)
- Project entries (as many as you have): name, thumbnail image, short description, full Markdown writeup, tech tags, result images, links
- Research paper implementation entries: paper name, what was implemented, repo link, short note
- Currently learning entries: topic, status, description
- Embedded lab pages: the actual HTML/Three.js files to embed + a title/caption for each
- Skill logos list
- 2–3 LinkedIn post screenshots + their post URLs
- Resume PDF
- (Optional, later) blog posts in Markdown

---

## 5. Explicit Non-Goals (things intentionally excluded, don't add unless asked)
- No 3D avatar/character centerpiece
- No particle/neural-mesh ambient background animation
- No scroll-jacking or hijacked scroll speed
- No live LinkedIn feed embed (not technically available)
- No fake testimonials section
- No physically drifting/floating cards — cards stay in fixed staggered positions, motion only on hover/click