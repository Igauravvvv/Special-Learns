# Special Learns Institute — website

A production-quality marketing site for **Special Learns Institute**, a computer
training institute at K-3, Mohan Garden, Uttam Nagar, New Delhi 110059.

Built with React 18 + Vite, React Router, and a small Express API that receives
enquiries.

---

## Quick start

```bash
npm install
npm run dev
```

- Frontend: <http://localhost:5173>
- Enquiry API: <http://127.0.0.1:8787>

Vite proxies `/api` to the Express server, so the browser only ever talks to
one origin. There are no API keys or secrets in the frontend.

### Production

```bash
npm run build     # generates sitemap.xml, then builds to dist/
npm start         # Express serves dist/ + the enquiry API on PORT (default 8787)
```

The server includes a SPA fallback, so deep links such as
`/courses/python` and `/programs/web-design-development` work on a hard
refresh.

### All commands

| Command             | What it does                                        |
| ------------------- | --------------------------------------------------- |
| `npm run dev`       | Vite dev server + enquiry API together              |
| `npm run dev:web`   | Vite only                                           |
| `npm run dev:server`| API only                                            |
| `npm run build`     | Regenerate sitemap, then production build           |
| `npm run sitemap`   | Rebuild `public/sitemap.xml` from route data        |
| `npm start`         | Serve the built site + API                          |

---

## Content and where to change it

All copy and data lives in `src/data/`, separated from layout:

| File                    | Contents                                             |
| ----------------------- | ---------------------------------------------------- |
| `site.js`               | Brand, address, phones, emails, socials, navigation  |
| `programs.js`           | 6 course areas + all 38 individual courses w/ modules |
| `tuition.js`            | _removed_ — the offering is no longer listed          |
| `testimonials.js`       | Real published reviews                                |
| `faqs.js`               | Questions and answers                                 |
| `studentWork.js`        | Gallery entries with alt text                         |
| `content.js`            | Value props, stats, process steps, About copy         |

### ⚠️ Content that still needs real business input

These are marked `TODO` in the source and **must be completed before launch**:

- **Fees and timings** — not published by the institute. FAQ answers currently
  say fees are confirmed on enquiry, which is honest but is not a policy.
- **Privacy policy** (`src/pages/PrivacyPolicy.jsx`) — written to match what the
  site actually does, but the retention period and any future analytics need a
  real decision and legal review.
- **Terms of use** (`src/pages/Terms.jsx`) — same; jurisdiction in particular
  needs confirming.
- **Enquiry delivery** — enquiries are stored and logged by default. To get
  emailed, set `RESEND_API_KEY` and `MAIL_TO` in `.env` (see Delivery below).

### What was deliberately *not* invented

The institute's existing website shows enrolment/staff counters that are
rendered as `0`, so **no enrolment numbers, staff counts, success rates or
certifications are claimed anywhere**. The statistics shown on the site are
counts of the institute's own published lists:

- 38 computer courses
- 6 course areas
- 3 diploma programmes

Testimonials are the institute's real published Google reviews, with first
names only.

---

## Enquiry form

The form posts to `POST /api/enquiries`. It will **not** report success unless
the server has actually stored the enquiry.

- The hero opens a native dialog with a short enquiry form; the same form is used on Contact.
- Name, phone **or** email, and contact consent are required. Course and message are optional.
- `shared/enquiry.js` provides the same validation to the browser and server.
- Course links preserve the chosen course and jump directly to the contact form.
- A durable append completes before a receipt/reference is returned. Email runs afterwards.
- A stable `Idempotency-Key` reuses the original receipt on retries. Concurrent writes are serialized within the Node process; use shared transactional database storage before running multiple API processes.
- Rate limited to 5 requests / 15 minutes per IP, with a honeypot and 16 KB body cap.
- Errors keep the learner’s entries; network timeouts allow safe retry. Native dialog focus is trapped and restored on close.
- `npm run enquiries` shows the latest 50 stored enquiries in the local staff terminal. This is a private CLI, not a public web inbox.
- `npm test` covers minimal contact details, consent, input bounds, concurrent retries, durable persistence, API responses, honeypots and rate limiting.
- Keep `ENQUIRY_FILE` on persistent storage in production. The default is a local append-only file, not a hosted database.

### Delivery

Every enquiry is **stored first**, then delivered on a best-effort basis by
`server/mailer.js`:

1. **Stored** — appended to `server/data/enquiries.ndjson` (path via `ENQUIRY_FILE`).
2. **Logged** — always printed to the terminal running the server, so nothing is
   ever invisible even with no provider configured.
3. **Emailed** — only if `RESEND_API_KEY` and `MAIL_TO` are set, sent through the
   Resend HTTP API (no extra npm dependency — plain `fetch`).

To enable email, add to `.env`:

```
RESEND_API_KEY=re_xxxxxxxx
MAIL_TO=admissions@speciallearns.in
MAIL_FROM=enquiries@your-verified-domain.com
```

**Delivery failure never fails the request.** If Resend rejects the key or times
out, the error is logged server-side, the enquiry stays on disk, and the visitor
still gets a truthful success response — because their enquiry genuinely was
received. This is tested.

For email enquiries, Reply-To uses the visitor’s address. Phone enquiries include a clickable phone number. Email notifications require the configuration above; local storage and the staff CLI work without it.

**Never put an API key in React.** Everything in `server/` runs on Node only; the
frontend only ever posts to a relative `/api/enquiries`.

---

## Design system

Tokens are CSS custom properties in `src/styles/tokens.css`.

Brand colours are sampled from the institute's own logo artwork — a deep royal
blue wordmark with crimson, magenta, orange, teal and gold in the emblem.
Surfaces use the pastel mint / cream / yellow palette.

- **Headlines & footer** — deep purple `#29204F`
- **Interactive** — indigo family, anchored on the logo blue
- **CTA** — gold `#FFC72C` with a blue offset shadow
- **Welcoming surfaces** — mint `#C8F0E2`
- **Cards** — cream `#FFF6E3`

Typography is Plus Jakarta Sans, loaded with `display=swap` and `preconnect`.

Illustrations (`src/components/illustrations/`) are original SVG written for
this project. Nothing is hotlinked, so the site renders identically offline.

---

## Accessibility

Verified with Lighthouse — **Accessibility 100, Best Practices 100, SEO 100,
zero failing audits.**

- Skip link, semantic landmarks, one `h1` per page
- Visible focus rings everywhere (`:focus-visible`)
- Mobile drawer: `aria-modal`, focus moved in, focus trapped, Escape closes,
  focus restored to the toggle, body scroll locked
- FAQ accordion follows the WAI-ARIA accordion pattern
- Gallery lightbox: arrow-key navigation, Escape to close, focus restored
- All form fields labelled, errors linked with `aria-describedby`
- `prefers-reduced-motion` disables all animation and transitions

---

## Performance & SEO

- Route-level code splitting via `manualChunks` (vendor / icons split out)
- Gzip: ~37 kB app + ~54 kB vendor + ~8 kB CSS
- Below-the-fold images are `loading="lazy"` with explicit dimensions, so there
  is no layout shift
- All 15 gallery images re-encoded locally to sRGB at 900 px (2.7 MB total)
- Per-page title, description, canonical URL and Open Graph tags
- `public/sitemap.xml` is generated from real route data
- Scroll animations use a single IntersectionObserver per element and
  disconnect after firing

### ⚠️ Before launch: server-side rendering

This is a client-rendered SPA. Google can execute JavaScript and will index it,
but for a local business competing in search, **prerendering is worth doing**.
The cheapest options, in order of effort:

1. **Vite SSG** — render each route to static HTML at build time. Every route is
   already known from `src/data/programs.js`, so this is mechanical.
2. **Astro or Next.js** static export around the existing components.

Do this before relying on organic search traffic.

---

## Known gaps

- No Google Analytics. Adding it means updating the privacy policy to name the
  provider.
- No map embed — the address links to a Maps search instead, because no
  verified coordinates were published.
- No live course dates or fees (see TODOs above).
- The footer's sitemap link points at `speciallearns.in/sitemap.xml`; update the
  origin in `src/data/site.js` if the domain changes.
- **Scroll animations were verified in code, not on screen.** The browser window
  in the build session went to the background, which freezes
  `requestAnimationFrame`, CSS transitions and IntersectionObserver. Reveal and
  count-up behaviour was therefore asserted through the DOM (element classes,
  computed values) rather than visually. Worth a quick manual pass — especially
  the highlight bands, blob tiles and the course library grid.

## Verification summary

Measured against the production build served by Express:

| Check | Result |
| --- | --- |
| Lighthouse (accessibility / best practices / SEO) | 100 / 100 / 100, zero failures |
| Routes checked | 10 |
| Viewports checked | 320, 375, 768, 800, 1024, 1280, 1600 |
| Horizontal overflow (all pages, all viewports) | 0 |
| Line length (all prose, wide viewports) | max 91 chars |
| Dead `href="#"` links | 0 |
| Broken images / missing alt | 0 / 0 |
| Console errors / invalid SVG geometry | 0 / 0 |
| `<h1>` per page | exactly 1, no skipped heading levels |
| Focusable elements without an accessible name | 0 of 111 |
| Enquiry API — valid / invalid / honeypot / malformed / rate limit | 201 / 400 / 400 / 400 / 429 |
| Enquiry stored even when email delivery fails | yes, verified |
| Course library — search, area filter, combined | 38 → 4 → 2, all correct |

### A note on `ch` units

Reading measures are set with explicit pixel tokens (`--sl-measure*`), not
`ch`. Plus Jakarta Sans has a wide `0` glyph, so a `54ch` cap resolved to
~950px and produced **150-character lines** on desktop — well past
comfortable. Heading line-lengths still use `ch`, which is what they are for.
