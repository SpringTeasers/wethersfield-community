# Wethersfield Community Site — `site/`

Static, single-page-per-section community website for **Wethersfield, Connecticut**.
Vanilla HTML/CSS/JS. **No frameworks, no build step, no dependencies.** Upload the
contents of this folder as-is and it runs.

Built to `design/design-system.md` v1.0, `design/wireframes.md` v1.0 and
`design/ia.md` v1.0, from the copy in `content/*.md`.

---

## 1. File inventory

```
site/
├── index.html          Home
├── about.html          About Wethersfield (history, population, government)
├── things-to-do.html   Things to Do (attractions, plan your visit)
├── businesses.html     Local Businesses (15 listings, search + category filter)
├── services.html       Town Services & Links (Town Hall, departments, libraries, schools, transit)
├── news-events.html    News & Events — SAMPLE SECTION, visibly marked (see §5)
├── contact.html        Contact (unconnected form, Town Hall details)
├── sources.html        Sources & Attributions (read-only list; noindex, footer-linked)
├── 404.html            Not-found hub (not in the sitemap, not required by host config)
├── css/
│   └── styles.css      Full design system: tokens, components, 5 breakpoints, print
├── js/
│   └── app.js          Mobile nav panel + business directory search/filter
├── images/
│   ├── favicon.svg     Hand-authored SVG monogram
│   └── og-default.svg  Hand-authored SVG Open Graph image
├── sitemap.xml         Public pages (relative <loc> values)
└── robots.txt          Allows all; disallows /sources.html
```

There is **no** photography. Every "image" is either an inline SVG illustration or a
CSS gradient. This is deliberate — no photos of Wethersfield buildings or businesses
existed in the source material, and none were fabricated.

---

## 2. Local preview

No build. Open `index.html` directly, or serve the folder:

```bash
cd site
python3 -m http.server 8000     # then open http://localhost:8000/
```

A plain `file://` open works too — every asset is referenced relatively.

---

## 3. Design system implementation

`css/styles.css` is organised in 16 numbered sections matching `design-system.md`:

| § | Section | Notes |
|---|---|---|
| 1 | Tokens | Full CSS custom-property set from `design-system.md` §8 |
| 2 | Reset & base | Box-sizing, fluid type, `:focus-visible` ring |
| 3 | Utilities | `.container`, `.section`, `.measure`, `.skip-link`, `.eyebrow` |
| 4 | Header & nav | Sticky header, desktop nav, full-screen mobile panel |
| 5 | Hero | Home hero (`.hero--home`), interior hero (`.hero--page`), anchor bar |
| 6 | Buttons | `.btn--primary` / `--secondary` / `--ghost-inverse` / `--link` |
| 7 | Cards | Business, attraction, service, stat, quick-link tile |
| 8 | Splits / prose / tables | `.split--8-4`, `.split--6-6`, `.prose`, `.data-table` |
| 9 | Notice band | The flagged-content component (see §5) |
| 10 | Directory controls | Filter bar, search input, chips, live count, empty state |
| 11 | Forms | Fields, inputs, textarea |
| 12 | Cross-link band | "Related" / "Keep exploring" tile rows |
| 13 | Closing CTA band | Home page only |
| 14 | Footer | 4-column grid, placeholder blocks |
| 15 | Fonts | Declares `Inter` via `local()`; falls back to the system stack |
| 16 | Print | Hides chrome, expands external link URLs |

**Colour:** `#1F4A3F` heritage green, `#A8412C` brick red (CTAs), `#C9A227` brass
(accents), `#F7F5F0` warm parchment surfaces, `#0B6FB8` focus ring.

**Breakpoints:** 360 / 640 / 768 / 1024 / 1280. Mobile-first — every rule is written
unprefixed and progressively enhanced with `min-width` media queries.

### Fonts

`design-system.md` specifies self-hosted **Fraunces** and **Inter** woff2 files. Those
font binaries are **not** in this folder. `styles.css` declares Inter via
`local("Inter")` and every rule lists the documented system fallback stack
(`system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial`), so the site renders
correctly with zero network requests and zero FOIT.

**To ship the exact design fonts:** add `css/fonts/*.woff2` and replace the
`@font-face` block at §15 with real `src: url(...)` rules plus
`<link rel="preload" as="font">` tags in each page head. That is the only change needed.

---

## 4. Accessibility

Target: **WCAG 2.2 AA**.

- Skip link is the first focusable element on every page.
- One `<h1>` per page; headings descend without skipping levels.
- Landmarks: `<header>`, `<nav aria-label="Primary">`, `<main id="main">`, `<footer>`.
- `aria-current="page"` on the active item in both desktop and mobile nav.
- Mobile panel: `aria-expanded` on the toggle, `inert` when closed, focus moved in on
  open, Esc to close, focus trap while open, auto-close if the viewport grows past 768px.
- Directory filter: chips are `aria-pressed`, the result count is an `aria-live`
  region, and the no-results state uses `role="status"`.
- Search inputs and form fields have real `<label>`s; required fields are marked
  visually with an asterisk **and** with `<span class="visually-hidden">(required)</span>`.
- Focus is never removed without a visible replacement.
- `prefers-reduced-motion` is honoured (see the final media query in `styles.css`).
- Decorative SVG is `aria-hidden` / `role="presentation"`; every icon has a text label
  beside it, so nothing depends on icon recognition alone.

---

## 5. Flagged / unresolved content — do not "tidy" these away

Three items in the research were explicitly marked unverified or sample by the
researcher and content writer. Each is rendered with the **notice band** component so
the status is visible to readers, not silently dropped. **They must stay marked.**

| Item | Where | Handling |
|---|---|---|
| **News & Events is a sample section** | `news-events.html`, plus the News preview block on `index.html` | Notice band + empty state. No event names, dates or venues were invented. Replace with real dated listings, or remove the section, before launch. |
| **Wethersfield Library link "to be confirmed"** | `services.html` → Libraries | Notice band. No URL guessed; the card points to the town's department directory instead. |
| **Town Hall email "needs verification"** | `contact.html` → Contact Details, and the footer of every page | Notice band. The address is **not published anywhere on the site**. |
| **Contact form / newsletter form** | `contact.html`, footer | Rendered but `disabled` with a `novalidate` form and explicit notice — no endpoint exists, so they must not ship looking functional. |
| **Map embed** | `contact.html` → Visit Us | Notice band. No verified map embed, so no map is shown. |
| **Social profile links** | Footer | Placeholder slots, clearly labelled; no invented profile URLs. |

Anything a reader could mistake for a real fact is either sourced (with a visible link)
or marked. Please preserve that distinction in any later edit.

---

## 6. Content fidelity

- Every factual claim, address, URL, percentage and statistic is reproduced from
  `content/*.md`, which in turn cites `research/*.md`.
- **All 15 business listings** from `content/businesses.md` appear in
  `businesses.html`, across the same five category headings, with names, addresses,
  descriptions and websites verbatim. None added, none dropped.
- Outbound links carry `target="_blank" rel="noopener"`.
- Internal links are relative (`about.html`, `images/favicon.svg`) — nothing is
  hard-coded to a domain, so the site works from any path or host.
- `canonical`, `og:url` and `og:image` use **relative** URLs (`index.html`,
  `images/og-default.svg`) because the production domain is not yet known. Adding a
  placeholder domain would be worse than a relative path. **If a production URL is
  later assigned, rewrite these to absolute URLs** — including the `<loc>` entries in
  `sitemap.xml`.

---

## 7. SEO

- Per-page `<title>` and `<meta name="description">` taken from each content file's
  Meta/SEO block.
- Full Open Graph set (`og:type`, `og:site_name`, `og:title`, `og:description`,
  `og:url`, `og:image`, `og:image:alt`) plus `twitter:card` on every public page.
- `sitemap.xml` lists the 7 public pages plus `sources.html`.
- `robots.txt` allows crawling and disallows `/sources.html`; that page also carries
  `<meta name="robots" content="noindex, follow">`, as does `404.html`.
- Semantic structure: one `<h1>`, real `<article>`/`<section>` elements, `<address>`
  for the Town Hall address, `<table>` with `<caption>` and `scope` for the
  demographics data.

---

## 8. Performance

- No frameworks, no libraries, no bundler, no external requests.
- **One** CSS file and **one** JS file, the script loaded with `defer`.
- All imagery is inline SVG or CSS gradients; there are no raster images to optimise.
- System font fallbacks mean no font download and no layout shift.
- Total page weight is a few tens of KB.

---

## 9. What this build deliberately does not do

- **No deployment.** Nothing was pushed. The Deploy Agent handles repo creation and
  hosting; per the Hostinger notes, connecting this GitHub repo to the website is a
  **manual dashboard step** (hPanel → Advanced → Git → Connect with GitHub), not
  something the API can do.
- **No server-side anything.** The contact and newsletter forms have no endpoint; the
  directory filter is entirely client-side.
- **No invented facts, businesses, events, photos or URLs.**

---

## 10. Verification performed

- All 9 HTML pages parse as well-formed documents with a single `<h1>` and balanced tags.
- Every internal link target resolves to a file in this folder
  (`index/about/things-to-do/businesses/services/news-events/contact/sources/404.html`).
- Every asset referenced (`css/styles.css`, `js/app.js`, `images/favicon.svg`,
  `images/og-default.svg`) exists.
- Every class used in the HTML is defined in `styles.css` — no orphan styling.
- `sitemap.xml` covers every public page; `robots.txt` matches the noindex set.
- The directory filter was traced against the markup: each `.business-card` carries
  `data-name`, `data-category`, `data-address` and `data-description`, and each chip's
  `data-filter` matches a category group's `data-category-group`.
