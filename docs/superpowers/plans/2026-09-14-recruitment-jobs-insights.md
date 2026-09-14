# Drs Rego: Recruitment, Jobs and Insights Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This plan file is copied to `docs/superpowers/plans/2026-09-14-recruitment-jobs-insights.md` in Task 0 and tracked there from then on.

**Goal:** Turn the nine-page hand-written Drs Rego site into an Eleventy-built site with a new audience-split navigation, a static jobs board with DPA/MMM eligibility blocks, two Netlify forms, a markdown Insights blog, an SEO audit, and two plain-English guides, all on branch `feature/recruitment-jobs-insights`.

**Architecture:** Eleventy 3 renders `src/` to `_site/`. One base layout replaces the header and footer pasted into nine files. Jobs and Insights are markdown files with front matter in `src/jobs/` and `src/insights/`, rendered to `/jobs/<slug>/` and `/insights/<slug>/`. Existing page URLs (`doctors.html`, `clinics.html` etc.) are preserved exactly via Eleventy permalinks, so nothing indexed moves and no redirects are needed. A pre-build validator fails the deploy with a plain-English message if a content file breaks a compliance rule (missing field, bad status, em dash, unresolved `[VERIFY:]` marker in a published file).

**Tech Stack:** Eleventy 3 (Nunjucks templates, markdown-it), Node 22 on Netlify, Netlify Forms, Netlify `_redirects` and `_headers`, vanilla JS, existing `styles.css`. No CSS framework, no client-side framework, no CMS.

**Spec:** The Context and Design sections below are the spec (written here because plan mode permits only this file). They are copied to `docs/superpowers/specs/2026-09-14-recruitment-jobs-insights-design.md` in Task 0.

## Global Constraints (from the brief; every task inherits these)

- No pricing anywhere. Enquiry-only.
- No outcome guarantees, no turnaround times for regulators. Never "takes 8 weeks", never "get you registered".
- No immigration or visa advice or implication. Visas and sponsorship: "referred to a registered migration agent".
- Every regulatory fact (DPA, MMM, s19AA, s19AB, PESCI, supervision) links to health.gov.au or ahpra.gov.au and carries a "Last verified" date. Unknown facts are written as `[VERIFY: ...]`. Do not guess, do not fill from memory.
- No em dashes in any copy, templates, meta tags or docs. Use commas, colons or full stops.
- Australian English: organisation, specialise, programme, practise (verb).
- Department name: "Department of Health, Disability and Ageing". Never "Health and Aged Care".
- Every candidate-facing form has a privacy link and an unsubscribe or consent-withdrawal path.
- Existing URLs are preserved exactly. New pages use clean directory URLs.
- Visual design: keep the current light editorial system (`--paper #FFFFFF`, `--ink #141B2E`, `--accent #2B4EFF`, `--slate #5A6376`, `--mist #ECEEF3`, Inter). Decision by Faisal, 14 September 2026. The supplied brand palette (dark `#1A1A1A`, grey `#9A9A9A`, lavender `#9AA3FF`, Instrument Sans) is recorded in CLAUDE.md as brand reference, not applied to the site.
- Never commit to `main`. All work on `feature/recruitment-jobs-insights`.
- Explain each significant change to Faisal in plain English as it lands. Small steps.

---

## Context

Drs Rego (drsrego.com.au) is a medical registration and compliance consultancy run part-time by Faisal Al-Falah, who is not a developer. The site is nine static HTML pages on Netlify. Faisal wants to add recruitment: a jobs board whose differentiator is stating DPA and MMM status with a verification date on every advert, a doctor interest form, a practice request form, and a blog. The navigation splits into doctor and practice tracks. Compliance rules above are hard requirements because the content sits near regulated advice.

**Task 0 findings (delivered in chat, 14 September 2026):** plain static HTML, no build step; nav duplicated in nine files; Netlify deploy path unknown (README says drag-and-drop, a GitHub remote exists at Ammsyd/drsrego-website); About page and clinics page explicitly disclaim recruitment; 72 em dashes; clinics FAQ states DPA/19AB facts without sources; "done right the first time" phrasing four times; logo PNG mentioned by Faisal is not in the repo (only SVGs); privacy policy does not cover anonymised-profile sharing.

**Decisions taken by Faisal, 14 September 2026:**
1. Recruitment is now a service. Rewrite About boundary, clinics heading and llms.txt.
2. Keep the existing website style for old and new pages.
3. Netlify connection to GitHub is unknown. DEPLOY.md assumes the connected-repo path and includes a check.
4. Eleventy build step approved.

**Decisions taken by Claude as the careful colleague (state these to Faisal when they land):**
- Keep existing `.html` URLs rather than 301 to `/for-doctors/`. The site launched July 2026; the URL words have negligible ranking effect; a redirect has nonzero risk and zero benefit. Listed under "needs my decision" in SEO-AUDIT.md if he wants clean URLs later.
- For Doctors and For Practices stay as one page each with anchored sections and an in-page jump list, not dropdown menus. Dropdowns are fiddly on phones and the content does not justify eight pages. Existing anchors (`#ahpra`, `#audit` etc.) are preserved.
- "Home" is the logo on desktop and the first item in the mobile menu. Seven text links plus a button will not fit beside the tagline at 1200px.
- "Ask us" on job pages links to the contact form with the role preselected and the message prefilled ("I would like to check my section 19AB position for: <job title>") and a hidden `job` field. The full CV form is too heavy for a question.
- No fake jobs. The board ships with a proper empty state and a template file. Publishing invented adverts would be fabricated records.
- Case studies are a `type: case-study` post inside Insights, not a fourth collection. One pattern to learn.
- Starter Insights posts ship as `draft: true` with `[VERIFY:]` markers. The validator refuses to publish any file containing a marker, so nothing unverified can go live by accident.
- Site-wide regulatory "last verified" dates live in one file, `src/_data/regulatory.json`, so the eligibility block and FAQ answers update from one place.

---

## Design

### Information architecture (Task 1 pressure test outcome)

Top nav (desktop): logo (home) · For Doctors · For Practices · Jobs · Insights · About · Contact · [Get in touch]
Mobile panel: Home · For Doctors · For Practices · Jobs · Insights · About · Contact · [Get in touch]
Footer: For doctors column, For practices column, Jobs and Insights column, Contact column, bottom bar with Privacy · Terms.

| Nav label | URL | Notes |
|---|---|---|
| Home | `/` | unchanged |
| For Doctors | `/doctors.html` | unchanged URL; jump list: Registration and pathways (#ahpra, #career), PESCI (#pesci-exemption, #pesci-prep), Supervision and fellowship (#supervision, #fellowship), Current opportunities (#opportunities, new) |
| For Practices | `/clinics.html` | unchanged URL; jump list: IMG-Readiness Audit (#audit), Supervisor matching and compliance (#supervisor-matching, #compliance), GP recruitment (#recruitment, new), Request a doctor (#request, new CTA block linking to the form) |
| Jobs | `/jobs/` | new listing; roles at `/jobs/<slug>/` |
| Insights | `/insights/` | new listing; posts at `/insights/<slug>/` |
| About | `/about.html` | unchanged |
| Contact | `/contact.html` | unchanged; gains hidden `job` and `topic` fields and prefill |
| Register your interest | `/register-your-interest/` | Form A, linked from doctors page, jobs pages, footer |
| Request a doctor | `/request-a-doctor/` | Form B, linked from practices page, footer |
| Privacy, Terms, Thank you, 404 | unchanged | |

Mobile menu breakpoint rises from 64em to 72em because the nav is wider.

### Repository layout after the work

```
eleventy.config.js
netlify.toml
package.json
CLAUDE.md  DEPLOY.md  CONTENT.md  SEO-AUDIT.md  README.md
docs/superpowers/specs/…  docs/superpowers/plans/…  docs/archive/FORM_FIX_REPORT.md  docs/archive/SEO_AUDIT_REPORT.md
scripts/validate-content.js   scripts/check-site.js
templates/job.md  templates/post.md  templates/case-study.md
src/
  _data/site.json  _data/regulatory.json
  _includes/layouts/base.njk  job.njk  post.njk
  _includes/partials/header.njk  footer.njk  eligibility.njk  job-card.njk  ask-us.njk  post-card.njk
  index.html  doctors.html  clinics.html  about.html  contact.html  privacy.html  terms.html  thank-you.html  404.html
  register-your-interest.html  request-a-doctor.html
  jobs/index.njk  jobs/jobs.11tydata.js  (jobs/*.md)
  insights/index.njk  insights/insights.11tydata.js  insights/*.md
  sitemap.njk  llms.txt
  static/robots.txt  _redirects  _headers  favicon.svg  apple-touch-icon.png   (passthrough to root)
  assets/css/styles.css  assets/js/main.js  assets/js/jobs.js  assets/img/…  (passthrough)
_site/  (build output, gitignored)
```

### Data contracts

**Job front matter** (`src/jobs/<slug>.md`):
```yaml
title: "VR or non-VR GP, Dubbo NSW"
slug: dubbo-gp-2026-09          # must equal the filename without .md
type: Full-time                 # Locum | Part-time | Full-time | Contract
specialty: General Practice
state: NSW                      # NSW | VIC | QLD | WA | SA | TAS | ACT | NT
region: Central West
suburb: Dubbo
postcode: "2830"                # optional, improves JobPosting schema
mmm: 3                          # integer 1 to 7
dpa: true                       # true = Distribution Priority Area, false = not
classification_checked: 2026-09-14
vr_required: false
img_eligible: true
sessions: "8 to 10 sessions per week"
start: "From November 2026"     # free text
posted: 2026-09-14
closes: 2026-11-30
status: open                    # open | filled | closed
description: "One sentence for search results, under 155 characters."
draft: false
```
Body: markdown. Headings start at `##` (the layout provides the h1). Sections suggested: About the role, About the practice, What the practice is looking for.

**Post front matter** (`src/insights/<slug>.md`):
```yaml
title: "19AA and 19AB explained: what you can bill, and where you can bill it"
description: "Under 155 characters."
date: 2026-09-14
last_verified: 2026-09-14
category: doctors               # doctors | practices
type: article                   # article | case-study
image: /assets/img/og-default.png   # optional, 1200x630
sources:
  - label: "Section 19AB of the Health Insurance Act 1973, Department of Health, Disability and Ageing"
    url: "https://www.health.gov.au/…"
    verified: 2026-09-14
related:
  - { label: "Medicare 19AB / 19AA exemption applications", url: "/doctors.html#medicare" }
draft: true
```

**`src/_data/site.json`:** name, legalName, abn, url `https://drsrego.com.au`, email, phone, phoneHref, locality, region, linkedin, facebook, author "Faisal Al-Falah", defaultImage `/assets/img/og-default.png`.

**`src/_data/regulatory.json`:** one entry per regulatory topic: `{ "s19ab": { "label": "…", "url": "…", "verified": "2026-09-14" }, "dpa": {…}, "mmm": {…}, "supervision": {…}, "pesci": {…} }`. URLs are only written after being fetched and confirmed live during execution; otherwise the value is `"[VERIFY: url]"` and the validator treats the site as unpublishable until resolved. (Validator rule: `[VERIFY:` in `regulatory.json` fails the build.)

### Eligibility block (rendered on every job page from `partials/eligibility.njk`)

> **Eligibility.** This position is at an MMM {{ mmm }} location classified {{ "a Distribution Priority Area" if dpa else "not a Distribution Priority Area" }} as at {{ classification_checked | dateAU }}. It suits {{ "a doctor who is subject to a section 19AB restriction, as well as doctors who are not" if img_eligible else "a doctor who is not subject to a section 19AB restriction, or who already holds an exemption that covers this location" }}. {{ "Vocational registration is required for this role." if vr_required else "Vocational registration is not required for this role." }} Vocational registration alone does not remove a section 19AB restriction. Source: [{{ regulatory.s19ab.label }}]({{ regulatory.s19ab.url }}), last verified {{ regulatory.s19ab.verified | dateAU }}.
>
> **Unsure where you sit? [Ask us →]** (primary button, links to `/contact.html?topic=eligibility&job={{ slug }}`)

Styled as a bordered panel (`.eligibility`) using `--accent` left border like `.legal-notice`, placed directly under the job summary table, above the body. The Ask us button is the only `.btn` above the fold on a job page.

### Job page status behaviour

| status | page | JobPosting JSON-LD | sitemap | listing |
|---|---|---|---|---|
| open | full | yes | yes | yes |
| filled | banner "This position has been filled" + body kept + links to open roles and Register your interest | no | no | no |
| closed | banner "Applications for this position have closed" + same | no | no | no |
| draft: true | not built | | | |

### Forms (all Netlify Forms, `data-netlify="true"`, `netlify-honeypot="bot-field"`, hidden `form-name`, `action="/thank-you.html"`)

- `enquiry` (contact.html, existing): add `<input type="hidden" name="topic">` and `<input type="hidden" name="job">`, prefilled by `main.js` from the query string; `role` select set to Doctor when `topic=eligibility`.
- `register-interest` (Form A): `enctype="multipart/form-data"`; fields exactly as the brief; `cv` file input `accept=".pdf,.doc,.docx"`, client-side size check 8 MB; consent checkbox with the brief's wording verbatim, required; privacy link; line "You can unsubscribe from our emails or withdraw this consent at any time by emailing info@drsrego.com.au."; hidden `job`.
- `request-doctor` (Form B): fields exactly as the brief; street address mandatory with the brief's helper text verbatim under it; consent checkbox linking to the Privacy Policy; unsubscribe line.

Thank-you page gets a `?form=` aware message (JS optional; default text works without JS).

### Structured data
- Home: existing ProfessionalService gains `"@type": ["ProfessionalService","LocalBusiness"]`-style dual typing? No: keep `ProfessionalService` (a LocalBusiness subtype) and add `image`, `priceRange` omitted (no pricing). WebSite kept.
- Jobs: JobPosting per open role; `ItemList` of open roles on `/jobs/`.
- Insights: `Article` per post (headline, description, datePublished, dateModified = last_verified, author Person Faisal Al-Falah, publisher Organization with logo, image, mainEntityOfPage); `Blog`/`CollectionPage` on listing optional (skip).
- BreadcrumbList on every non-home page, generated in base layout from `breadcrumb` front matter.
- FAQPage kept where it exists; new facts carry sources and dates in the visible answer.

### Open Graph
Base layout emits og:type (`article` for posts, `website` otherwise), og:title, og:description, og:url, og:image (page `image` or `site.defaultImage`, absolute), og:image:width/height, og:locale `en_AU`, twitter card, and for posts `article:published_time`, `article:modified_time`, `article:section`. Default OG image `assets/img/og-default.png` (1200×630, white ground, blue logo, tagline) generated with Pillow in Task 8.

### Validation and checks
- `scripts/validate-content.js` (runs before Eleventy): jobs and posts front matter schema, enums, ISO dates, slug = filename, em dash (U+2014) scan in all `src/**/*.{md,html,njk,json,txt}`, `[VERIFY:` scan in non-draft md and in `regulatory.json`, "Health and Aged Care" scan, `$` followed by digit scan in md (pricing guard). Prints `✗ src/jobs/x.md: status must be one of open, filled, closed (found "Open")` and exits 1.
- `scripts/check-site.js` (runs after build): every internal href/src in `_site` resolves; exactly one `<h1>` per page; every `<img>` has non-empty alt; every JSON-LD block parses; titles unique across pages; every page has canonical; no em dash in output HTML text.
- `npm test` = validate + build + check. Every task ends with `npm test` green and a commit.

### What Task 7 will say (write into the final message, expand from execution findings)
- Wrong approach corrected: no URL migration; no dropdowns; Home as logo; no fake jobs.
- Simpler CMS: edit markdown in the GitHub web editor from a template, deploy preview checks it, merge. Decap CMS deferred; revisit only if YAML errors bite after a month.
- Missed: analytics (site has none, so "Ask us" conversions cannot be measured); founder credibility on About (E-E-A-T); privacy policy update for recruitment (lawyer); Google Business Profile; supervisor expression-of-interest form (supply side of supervisor matching); a page describing how Drs Rego verifies DPA and MMM (trust asset).
- Highest impact not on the list: a standing "Check where you sit with 19AB" enquiry block on the doctors page and in every post, independent of the jobs board, because the board starts empty and the eligibility question is the hook.
- Over-engineering: separate case-study collection (folded in); sitemap priorities (dropped); FAQ schema for rich results (Google restricted FAQ rich results to government and health authority sites in 2023, so it is harmless but not worth effort); Decap CMS now.

---

## Tasks

### Task 0: Branch, CLAUDE.md, spec and plan files

**Files:**
- Create: `CLAUDE.md`, `docs/superpowers/specs/2026-09-14-recruitment-jobs-insights-design.md`, `docs/superpowers/plans/2026-09-14-recruitment-jobs-insights.md`

- [ ] **Step 1:** `git checkout -b feature/recruitment-jobs-insights`
- [ ] **Step 2:** Write `CLAUDE.md` with sections: What this project is; Stack and build (Eleventy, `npm run build`, `_site`, Netlify); Repository map; Brand (site tokens in use, supplied brand palette as reference, Inter, logo files and the note that the source PNG needs ~40% whitespace cropped before use and is not yet in the repo); Hard content rules 1 to 8 verbatim from the brief; Regulatory sourcing workflow (`regulatory.json`, `[VERIFY:]`, validator); Content workflow pointers (CONTENT.md, DEPLOY.md); Git rules (never commit to main, branch naming, small commits, explain changes in plain English); Verification (`npm test`, browser check, forms check in Netlify); Decisions log with dates.
- [ ] **Step 3:** Copy the Context and Design sections of this plan into the spec file, and this whole plan into the plans file.
- [ ] **Step 4:** `git add CLAUDE.md docs && git commit -m "docs: add CLAUDE.md, design spec and implementation plan"`
- [ ] **Step 5:** Tell Faisal in plain English: branch created, CLAUDE.md written, what is in it.

### Task 1: Eleventy scaffold with preserved URLs and the new navigation

**Files:**
- Create: `package.json`, `eleventy.config.js`, `netlify.toml`, `src/_data/site.json`, `src/_includes/layouts/base.njk`, `src/_includes/partials/header.njk`, `src/_includes/partials/footer.njk`
- Move (git mv): `index.html, doctors.html, clinics.html, about.html, contact.html, privacy.html, terms.html, thank-you.html, 404.html` → `src/`; `assets/` → `src/assets/`; `robots.txt, favicon.svg, apple-touch-icon.png` → `src/static/`; `llms.txt` → `src/llms.txt`; `sitemap.xml` deleted (regenerated in Task 4)
- Modify: `.gitignore` (add `_site/`), `.claude/launch.json` (serve `_site` on 8734)

**Interfaces produced:** layout `layouts/base.njk` consuming front matter `title, description, canonical (auto from page.url), image, ogType, navSection, breadcrumb, noindex, preloadImage, extraHead`; global `site` data; filters `dateAU`, `isoDate`, `absoluteUrl`; collection helpers defined in Task 4 and 8.

- [ ] **Step 1:** `npm init -y`, then `npm install --save-dev @11ty/eleventy@^3`. Set `"scripts": { "build": "node scripts/validate-content.js && eleventy", "serve": "eleventy --serve --port 8734", "check": "node scripts/check-site.js", "test": "npm run build && npm run check" }`. (Scripts files arrive in Task 2; until then run `npx eleventy` directly.)
- [ ] **Step 2:** Write `eleventy.config.js`:

```js
export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/static": "." });
  eleventyConfig.addPreprocessor("drafts", "*", (data) => { if (data.draft) return false; });

  const toDate = (d) => (d instanceof Date ? d : new Date(d));
  eleventyConfig.addFilter("dateAU", (d) =>
    toDate(d).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }));
  eleventyConfig.addFilter("isoDate", (d) => toDate(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("absoluteUrl", (path, base) => new URL(path, base).href);
  eleventyConfig.addFilter("jsonld", (obj) => JSON.stringify(obj, null, 2).replace(/</g, "\\u003c"));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["html", "njk", "md", "txt"],
  };
}
```
- [ ] **Step 3:** Write `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "_site"
[build.environment]
  NODE_VERSION = "22"
```
- [ ] **Step 4:** Write `src/_data/site.json` with the values from README §1 (email, phone, ABN, socials, Sydney NSW, url `https://drsrego.com.au`, author `Faisal Al-Falah`, defaultImage `/assets/img/hero-consult-1600.jpg` until Task 8 replaces it).
- [ ] **Step 5:** Write `base.njk`: the shared `<head>` (charset, viewport, title `{{ title }} | Drs Rego` unless `titleRaw`, description, canonical `{{ page.url | absoluteUrl(site.url) }}`, OG and twitter block per the Design, `noindex` meta when set, fonts preconnect + Inter link, optional `preloadImage` block, `/assets/css/styles.css`, `/assets/js/main.js` defer, BreadcrumbList JSON-LD when `breadcrumb` set, `{{ extraHead | safe }}`), then skip link, `{% include "partials/header.njk" %}`, `<main id="main">{{ content | safe }}</main>`, `{% include "partials/footer.njk" %}`.
- [ ] **Step 6:** Write `header.njk` with the new nav. Each link: `<a href="/doctors.html"{% if navSection == "doctors" %} aria-current="page"{% endif %}>For Doctors</a>`. Items: Home (class `nav-home`, shown only in the mobile panel via CSS), For Doctors, For Practices, Jobs, Insights, About, Contact, then `.btn` Get in touch. Logo links `/`.
- [ ] **Step 7:** Write `footer.njk` from the existing footer, with columns: For doctors (existing anchors + Register your interest), For practices (existing anchors + GP recruitment + Request a doctor), Jobs and Insights (Jobs, Insights, About), Contact. All hrefs root-absolute. Em dashes in the footer replaced.
- [ ] **Step 8:** For each moved page: strip `<head>`, header, footer and `<main>` wrapper; add front matter:
```yaml
---
layout: layouts/base.njk
title: "AHPRA Registration Support for IMGs"
titleRaw: true          # only where the existing title already ends in "| Drs Rego"
description: "…existing…"
permalink: doctors.html
navSection: doctors
image: /assets/img/doctor-phone-1600.jpg
imageAlt: "…"
preloadImage: { srcset: "…", sizes: "…" }
breadcrumb: { name: "For Doctors" }
extraHead: |
  <script type="application/ld+json">…existing FAQ block…</script>
---
```
Keep body sections verbatim for now (copy fixes come in Task 3). Convert every `assets/…` and `page.html` href to root-absolute (`/assets/…`, `/page.html`). `404.html` and `thank-you.html` get `noindex: true`. `index.html` permalink `/`.
- [ ] **Step 9:** CSS: add `.nav-home { display: none }` at desktop, shown inside the mobile panel; move the mobile breakpoint from `64em` to `72em` (two rules: `.nav-toggle` display and `.site-nav` panel); `@media (max-width: 78em) .brand-tag` becomes `max-width: 26ch`.
- [ ] **Step 10:** `npx eleventy`. Confirm `_site/` contains `index.html, doctors.html, clinics.html, about.html, contact.html, privacy.html, terms.html, thank-you.html, 404.html, assets/, robots.txt, favicon.svg, apple-touch-icon.png, llms.txt`.
- [ ] **Step 11:** Start the preview server (`.claude/launch.json` → `python -m http.server 8734 --directory _site`) and check in the browser: home renders identically apart from the nav; nav shows seven items on mobile and six plus logo on desktop; the Calendly widget on contact still loads; keyboard focus trap in the menu still works.
- [ ] **Step 12:** Commit: `git add -A && git commit -m "build: move site to Eleventy with preserved URLs and new navigation"`.
- [ ] **Step 13:** Tell Faisal: what Eleventy is, what moved where, that every address is unchanged, that the nav now has the new labels.

### Task 2: Validator and site checker

**Files:** Create `scripts/validate-content.js`, `scripts/check-site.js`. Zero dependencies beyond Node built-ins; front matter parsed with a small `---` splitter and `js-yaml` (add `npm i -D js-yaml`).

- [ ] **Step 1:** Write `validate-content.js` implementing the Design rules. Job schema: required `title, slug, type, specialty, state, region, suburb, mmm, dpa, classification_checked, vr_required, img_eligible, sessions, start, posted, closes, status, description`; enums per Design; `mmm` integer 1 to 7; dates match `/^\d{4}-\d{2}-\d{2}$/` after YAML parse (compare `String(value).slice(0,10)`); `slug === basename`. Post schema: `title, description, date, last_verified, category, type (default article)`; `category` in `doctors|practices`. Global scans over `src/**`: U+2014 anywhere; `[VERIFY:` in non-draft `.md` and in `_data/regulatory.json`; `/Health and Aged Care/`; `/\$\s?\d/` in `.md`. Output one line per problem with file path and a plain-English fix, then `process.exit(1)`. On success print `Content OK: N jobs (M open), P posts (Q published)`.
- [ ] **Step 2:** Prove it fails: temporarily create `src/jobs/bad.md` with `status: Open` and an em dash, run `node scripts/validate-content.js`, expect exit 1 with two messages. Delete the file.
- [ ] **Step 3:** Write `check-site.js`: walk `_site/**/*.html`; for each file collect `href`/`src`/`srcset` values starting with `/` or relative, resolve against `_site`, report missing; count `<h1`; find `<img` without `alt="…"` non-empty; extract `<script type="application/ld+json">` blocks and `JSON.parse`; collect `<title>` and report duplicates; require `<link rel="canonical"`; report U+2014 in text nodes. Exit 1 on any problem.
- [ ] **Step 4:** `npm test` → expect failures listing the existing em dashes (the output currently has them). That is the expected red state that Task 3 turns green. Commit scripts: `git commit -m "build: add content validator and built-site checker"`.
- [ ] **Step 5:** Tell Faisal: there is now a safety net; if a job or post file has a mistake, the deploy stops and says exactly what to fix.

### Task 3: Copy compliance sweep and recruitment positioning

**Files:** Modify `src/index.html, doctors.html, clinics.html, about.html, contact.html, privacy.html, terms.html, 404.html, thank-you.html, llms.txt, _includes/partials/footer.njk`; Create `src/_data/regulatory.json`.

- [ ] **Step 1:** Fetch and confirm live these source pages (WebFetch), then record label, url, verified `2026-09-14` in `regulatory.json`: section 19AB (health.gov.au), DPA (health.gov.au), MMM (health.gov.au), Health Workforce Locator (health.gov.au), supervised practice for IMGs (ahpra.gov.au or medicalboard.gov.au), PESCI (ahpra.gov.au / medicalboard.gov.au). Any that cannot be confirmed get `"url": "[VERIFY: exact health.gov.au page for …]"`.
- [ ] **Step 2:** Replace every `&mdash;` and `—` in the listed files with a comma, colon or full stop, re-reading each sentence so it still scans. Meta descriptions included.
- [ ] **Step 3:** Rewrite outcome phrases: index lede "with the paperwork done right the first time" → "with the paperwork prepared to the standard the regulators expect"; "Supervision plans drafted correctly the first time" (index and doctors) → "Supervision plans drafted to the Board's requirements"; about lede "correctly, in order, the first time" → "correctly and in the right order".
- [ ] **Step 4:** Recruitment positioning: about.html boundaries paragraph → "We also recruit. Practices engage us to find doctors whose registration and Medicare position genuinely fits the role, and every doctor we introduce has been assessed for that fit before an introduction is made. When we advise both a doctor and their employing practice, both parties know." Clinics H2 "A compliance partner, not a recruiter." → "Compliance first. Recruitment second, and only when the fit is right." llms.txt About line and services updated; add Jobs and Insights lines.
- [ ] **Step 5:** Clinics FAQ: each regulatory answer gets a trailing sentence "Source: <a href="{{ regulatory.dpa.url }}">…</a>, last verified {{ regulatory.dpa.verified | dateAU }}." Where a fact is uncertain (for example the supervisor eligibility answer), rewrite conservatively and add `[VERIFY: …]` in a draft note to Faisal rather than in published HTML: the answer text becomes "The Medical Board of Australia sets who may supervise; we assess your existing doctors against its current requirements." with the source link. Update the matching FAQPage JSON-LD text.
- [ ] **Step 6:** Add "Sydney, NSW" unchanged; confirm no "Health and Aged Care" anywhere; confirm privacy.html and terms.html only lost em dashes.
- [ ] **Step 7:** `npm test` green. Commit `content: remove em dashes, outcome phrases; recruitment positioning; sourced FAQ facts`.
- [ ] **Step 8:** Tell Faisal exactly which sentences changed and why, and list any `[VERIFY:]` items for him.

### Task 4: Jobs board

**Files:** Create `src/jobs/jobs.11tydata.js`, `src/jobs/index.njk`, `src/_includes/layouts/job.njk`, `src/_includes/partials/eligibility.njk`, `src/_includes/partials/job-card.njk`, `src/assets/js/jobs.js`, `templates/job.md`, `src/sitemap.njk`; Modify `eleventy.config.js` (collections), `src/doctors.html` (#opportunities), `styles.css` (jobs components), `src/_includes/partials/footer.njk`.

**Interfaces produced:** collections `jobs` (all non-draft), `openJobs` (status open, sorted by `posted` desc); partial `job-card.njk` expecting a job page object; partial `eligibility.njk` expecting the job's data in scope.

- [ ] **Step 1:** `jobs.11tydata.js`:
```js
export default {
  layout: "layouts/job.njk",
  tags: ["jobs"],
  navSection: "jobs",
  eleventyComputed: {
    permalink: (data) => `/jobs/${data.slug || data.page.fileSlug}/`,
    breadcrumb: (data) => ({ parent: { name: "Jobs", url: "/jobs/" }, name: data.title }),
  },
};
```
`src/jobs/index.njk` front matter overrides: `tags: []`, `eleventyExcludeFromCollections: true`, `permalink: /jobs/`, `layout: layouts/base.njk`, `title: "GP jobs in Australia with DPA and MMM status"`, `description`.
- [ ] **Step 2:** Collections in `eleventy.config.js`:
```js
const byPostedDesc = (a, b) => new Date(b.data.posted) - new Date(a.data.posted);
eleventyConfig.addCollection("jobs", (api) => api.getFilteredByTag("jobs").sort(byPostedDesc));
eleventyConfig.addCollection("openJobs", (api) =>
  api.getFilteredByTag("jobs").filter((j) => j.data.status === "open").sort(byPostedDesc));
```
- [ ] **Step 3:** `job.njk` (extends base via `layout: layouts/base.njk` in its own front matter): eyebrow `{{ type }} · {{ specialty }}`, `<h1>{{ title }}</h1>`, status banner for filled/closed, summary `<dl>` (Location: suburb, region, state; Type; Sessions; Start; Posted; Closes; VR required yes/no; MMM; DPA yes/no as at date), `{% include "partials/eligibility.njk" %}`, `<div class="prose">{{ content | safe }}</div>`, secondary CTA "Register your interest for this role" → `/register-your-interest/?job={{ slug }}`, tertiary "Back to all jobs". `extraHead` computed: when `status == "open"`, JobPosting JSON-LD via the `jsonld` filter with fields per Design (employmentType map: Locum→TEMPORARY, Part-time→PART_TIME, Full-time→FULL_TIME, Contract→CONTRACTOR; `validThrough` = closes at `T23:59:59+10:00`; description = rendered body HTML). Filled/closed: no JobPosting.
- [ ] **Step 4:** `eligibility.njk` exactly per the Design text. Class `.eligibility`; heading `<h2 class="eligibility-title">Eligibility</h2>`; Ask us `.btn`. Add CSS: panel with `border: 1px solid var(--accent); border-left: 4px solid var(--accent); padding: var(--s-3); margin-block: var(--s-4); max-width: var(--measure);` and `.eligibility .btn { margin-top: var(--s-2) }`.
- [ ] **Step 5:** `job-card.njk`: `<article class="job-card" data-state data-type data-specialty data-img data-dpa data-vr>` with h3 link, meta line "Dubbo, NSW · MMM 3 · DPA · Full-time", one-line eligibility summary ("Suits doctors with or without a 19AB restriction" / "19AB-unrestricted doctors only"), posted date. Listing `index.njk`: intro paragraph explaining that every advert states DPA and MMM status with the date checked; filter bar (`<form class="job-filters" aria-label="Filter jobs">` with selects State, Type, and checkbox "Show only roles suitable for doctors with a 19AB restriction", built from the collection's distinct values; a live region `<p id="jobs-count" aria-live="polite">`); grid of cards from `collections.openJobs`; empty state when none: "No open roles right now. Register your interest and we will contact you when a matching position opens." with the Register button; `ItemList` JSON-LD of open jobs.
- [ ] **Step 6:** `jobs.js` (deferred, only on `/jobs/`): reads filter values, toggles `hidden` on cards, updates the count text "3 of 5 roles shown", persists nothing. Without JS all cards show and the filter form is hidden via `.no-js .job-filters { display: none }`.
- [ ] **Step 7:** `templates/job.md` with the front matter from the Design, every value set to an obvious placeholder (`title: "REPLACE: role title, town STATE"`), `draft: true`, and a body skeleton with comments explaining each field in one line, including "check MMM and DPA on the Health Workforce Locator, then set classification_checked to today".
- [ ] **Step 8:** `sitemap.njk` (`permalink: /sitemap.xml`, `eleventyExcludeFromCollections: true`): loop `collections.all`, skip pages with `noindex` or `status` in filled/closed or url in `/404.html`, emit `<loc>` absolute and `<lastmod>` from `last_verified || date || posted || page.date`. No priorities.
- [ ] **Step 9:** doctors.html: new section `id="opportunities"` after services: heading "Current opportunities", up to three `job-card` includes from `collections.openJobs | head(3)` (add a `head` filter or use `slice`), empty-state sentence, links to `/jobs/` and `/register-your-interest/`. Add the in-page jump list under the hero.
- [ ] **Step 10:** Create one real-looking but clearly draft file `src/jobs/example-role.md` copied from the template with `draft: true` to prove rendering in dev (`ELEVENTY_RUN_MODE` not needed: temporarily flip `draft` locally, build, inspect `/jobs/example-role/` and `/jobs/`, then flip back). Confirm: eligibility text for `img_eligible: true` and `false`; JobPosting present only when open; filled banner; sitemap excludes filled; listing filter works in the browser.
- [ ] **Step 11:** `npm test` green. Commit `feat: jobs board with eligibility block and JobPosting schema`. Tell Faisal how a job file works and what the eligibility block says, with a screenshot.

### Task 5: Contact prefill and reusable Ask-us block

**Files:** Modify `src/contact.html`, `src/assets/js/main.js`; Create `src/_includes/partials/ask-us.njk`.

- [ ] **Step 1:** contact.html: add hidden inputs `topic`, `job`; keep field names.
- [ ] **Step 2:** main.js: generalise section 4 to `document.querySelectorAll("form[data-validate]")`; add section 5 "prefill from query string": if `topic=eligibility`, set `#role` to "Doctor", `topic` hidden value, `job` hidden value, and if `#message` empty set it to `"I would like to check my section 19AB position" + (job ? " for the role: " + job : "") + "."`. Add `data-validate` to the enquiry form. File-size check helper for later forms: on `change` of `input[type=file]`, if `files[0].size > 8 * 1024 * 1024` show error "Please upload a file under 8 MB." and clear the input.
- [ ] **Step 3:** `ask-us.njk`: a short band "Unsure where you sit with section 19AB? Tell us your registration date and where you trained, and we will tell you plainly what applies." + Ask us button to `/contact.html?topic=eligibility`. Include it on doctors.html (after #medicare) and at the bottom of every Insights post (Task 8).
- [ ] **Step 4:** Browser check: open `/contact.html?topic=eligibility&job=example-role`, confirm role and message are prefilled and hidden fields set (read DOM). `npm test`. Commit `feat: contact prefill for eligibility questions and Ask-us block`.

### Task 6: Form A, Register your interest

**Files:** Create `src/register-your-interest.html`; Modify `styles.css` (fieldset/legend, radio group, file input), `src/thank-you.html`.

- [ ] **Step 1:** Page front matter: `permalink: /register-your-interest/`, `title: "Register your interest in GP roles"`, `navSection: doctors`, breadcrumb. Intro: what happens after submitting (we read it, we contact you before anything is shared, no identifying details go to a practice without further approval). Form `name="register-interest" method="POST" data-netlify="true" netlify-honeypot="bot-field" enctype="multipart/form-data" action="/thank-you.html" data-validate novalidate`. Fields in the brief's order with `<label for>`, `autocomplete`, `inputmode`, and `<fieldset><legend>` for the yes/no radio ("Vocationally registered?"). AHPRA number optional with hint "Optional. Format MED0001234567." Country: text with `autocomplete="country-name"`. Date of first Australian registration: `type="month"` fallback text hint "Month and year". Registration type: select (Limited, Provisional, General, Specialist, Not yet registered). Fellowship or pathway: select (FRACGP, FACRRM, Working towards fellowship, Not on a pathway yet, Other). Preferred locations: textarea with hint "States, regions or towns". Availability: text. CV: file input, accept `.pdf,.doc,.docx`, hint "PDF or Word, under 8 MB". Consent checkbox: the brief's wording verbatim, required, with the mailto link. Below: "Read our <a href="/privacy.html">Privacy Policy</a>. You can unsubscribe from our emails or withdraw this consent at any time by emailing info@drsrego.com.au." Hidden `job` prefilled by main.js from `?job=`.
- [ ] **Step 2:** thank-you.html: if `?form=register` (set via a hidden `form` field? Netlify redirects to the static `action`; instead use two thank-you variants: `action="/thank-you.html?form=register"` is allowed by Netlify) show "Thank you. We will read your registration and contact you before anything is shared with a practice." via a small JS switch; default text otherwise.
- [ ] **Step 3:** Browser check on the local preview: all fields labelled, tab order sensible, validation messages appear, honeypot invisible, `enctype` present in DOM. `npm test`. Commit `feat: register-your-interest form (Netlify Forms)`.

### Task 7: Form B, Request a doctor, and the practices page recruitment block

**Files:** Create `src/request-a-doctor.html`; Modify `src/clinics.html`.

- [ ] **Step 1:** Page `permalink: /request-a-doctor/`, `navSection: practices`. Form `name="request-doctor"`. Fields: Practice name; ABN (`inputmode="numeric"`, hint "11 digits"); Street address (required, textarea two lines, `autocomplete="street-address"`), helper text verbatim from the brief in a `<p class="hint" id="address-help">` referenced by `aria-describedby`; Contact name; Contact role; Position type (select: Locum, Part-time, Full-time, Contract); Sessions; VR required (fieldset radios Yes / No / Either); Existing IMG or registrar employees (select: None, One, Two or more); Supervision capacity (select: Yes, an approved supervisor is available / Not sure / No); Timeframe (select: Immediately, Within 3 months, 3 to 6 months, Planning ahead); Anything else (textarea, optional). Consent checkbox: "I consent to Drs Rego collecting these details to assess and respond to this request, as described in the Privacy Policy." Unsubscribe line. Note under the form: "We do not provide immigration or visa advice. Where a role involves sponsorship, that is referred to a registered migration agent."
- [ ] **Step 2:** clinics.html: new service block `#recruitment` "GP recruitment, compliance first" (copy: we verify DPA and MMM for your street address and the doctor's 19AB position before any introduction; no guarantees, no timeframes); new CTA block `#request` linking `/request-a-doctor/`; jump list under the hero.
- [ ] **Step 3:** Browser check, `npm test`, commit `feat: request-a-doctor form and practices recruitment section`.

### Task 8: Insights

**Files:** Create `src/insights/insights.11tydata.js`, `src/insights/index.njk`, `src/_includes/layouts/post.njk`, `src/_includes/partials/post-card.njk`, three posts, `templates/post.md`, `templates/case-study.md`, `src/assets/img/og-default.png` (+ script in scratchpad); Modify `eleventy.config.js` (collection `posts`), `styles.css` (`.prose`, `.post-meta`, `.verified`, `.sources`).

- [ ] **Step 1:** `insights.11tydata.js`: `layout: layouts/post.njk`, `tags: ["insights"]`, `navSection: insights`, `type: "article"`, computed permalink `/insights/${fileSlug}/`, breadcrumb. Collection `posts` sorted by `date` desc; `postsDoctors`, `postsPractices` filtered by category.
- [ ] **Step 2:** `post.njk`: eyebrow "{{ category | capitalize }} · {{ 'Case study' if type == 'case-study' else 'Insight' }}", h1, meta line "Published {{ date | dateAU }} · Last verified {{ last_verified | dateAU }}", `.prose` body, Sources list rendered from `sources` (label, link, verified date), Related services links from `related`, `{% include "partials/ask-us.njk" %}`, "More insights" three cards. `extraHead`: Article JSON-LD per Design and `ogType: article` with `article:*` metas (handled in base via `ogType`).
- [ ] **Step 3:** Listing `index.njk`: intro, two tabbed lists via simple anchor links `#doctors` / `#practices` (no JS), cards via `post-card.njk` (title link, description, date, verified date, category badge).
- [ ] **Step 4:** Generate `og-default.png` 1200×630 with Pillow in the scratchpad (white ground, blue logo rendered from `logo-blue.svg` via cairosvg if available, otherwise a text lockup "Drs Rego" in Inter/Arial bold `#2B4EFF` with tagline in `#5A6376`). Set `site.defaultImage` to it. Update the home `og:image` to it too.
- [ ] **Step 5:** Write the three posts in Faisal's voice (direct, practical, no hype, no em dashes), each `draft: true`, `last_verified: 2026-09-14`, with `[VERIFY: …]` on every regulatory claim and a `sources` list pointing at the `regulatory.json` URLs:
  1. `19aa-and-19ab-explained.md` (category doctors): what 19AA restricts (vocational recognition and Medicare rebates), what 19AB restricts (overseas-trained doctors and provider numbers for ten years from first registration), how DPA and MMM enter the picture, that exemptions are location-specific, what changes and what does not when you gain fellowship, and how to ask.
  2. `does-fellowship-end-my-10-year-moratorium.md` (doctors): short answer no; fellowship affects 19AA; 19AB runs from the date of first Australian medical registration [VERIFY: precise trigger]; common misconceptions; what does shorten it [VERIFY: scaling and the 2023/2024 changes]; what to do next.
  3. `how-to-check-whether-your-practice-is-in-a-dpa-catchment.md` (practices): step-by-step on the Health Workforce Locator [VERIFY: exact steps and URL], why street address matters (catchments, not suburbs), MMM alongside DPA, how often classifications change [VERIFY], record the date you checked, and what Drs Rego does before shortlisting.
- [ ] **Step 6:** Templates `post.md` and `case-study.md` (case study skeleton: The situation, What we found, What we did, The outcome stated without guarantees, with an explicit reminder to anonymise).
- [ ] **Step 7:** Temporarily flip one post to `draft: false`, build, inspect `/insights/` and the post, validate Article JSON-LD parses and OG tags render, flip back. `npm test`. Commit `feat: insights blog with article schema and three draft starter posts`. Tell Faisal the posts are drafts until he resolves each `[VERIFY]`, and list them.

### Task 9: Accessibility review of the two forms

- [ ] **Step 1:** Invoke `design:accessibility-review` on `/register-your-interest/` and `/request-a-doctor/` (built HTML plus a browser pass at 375px with the mobile preset). Apply fixes: label association, error message `aria-describedby`, focus order, target sizes 44px, contrast of hint text (`--slate` on white is 7:1, fine), `autocomplete` tokens, radio group legends, file input labelling, no placeholder-only labels.
- [ ] **Step 2:** `npm test`, commit `a11y: form fixes from accessibility review`.

### Task 10: Design pass with impeccable

- [ ] **Step 1:** Invoke `impeccable:impeccable` on the header/nav, `/jobs/`, a job page, `/insights/`, a post, and both forms. Brief it with the Global Constraints and "keep the existing editorial-minimal system; hierarchy and mobile first; the Ask us button is the primary conversion". Apply its material fixes only.
- [ ] **Step 2:** Browser check at 375, 768 and 1280 widths; screenshots for Faisal. `npm test`, commit `design: hierarchy and mobile polish for nav, jobs, insights, forms`.

### Task 11: SEO audit and fixes

**Files:** Create `SEO-AUDIT.md`, `src/static/_redirects`, `src/static/_headers`; Modify pages as the audit dictates.

- [ ] **Step 1:** Invoke `marketing:seo-audit` against the built `_site` (titles, descriptions, H1s, schema, sitemap, robots, canonicals, CWV factors, internal links, alt text, mobile, broken links). Record findings.
- [ ] **Step 2:** `_redirects`: `/thanks.html /thank-you.html 301` and commented examples. `_headers`: `/*` with `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`. No CSP (Calendly and Google Fonts make it fiddly; list under out of scope).
- [ ] **Step 3:** robots.txt: add `Disallow: /thank-you.html`. Confirm sitemap URL. Internal links: every post links to at least two service anchors and one other post; doctors and practices pages link to Insights.
- [ ] **Step 4:** Write `SEO-AUDIT.md` with three sections (Fixed already / Needs my decision / Out of scope for now), then "The three that move the needle" and "Correct but not worth this quarter". Candidates for the three: (1) publish the three posts after verification, they target the exact questions doctors search; (2) get Netlify connected to Git so deploys and sitemap stay current, and resubmit the sitemap in Search Console; (3) founder bio with credentials on About for trust signals. Needs decision: clean URLs migration; analytics; Google Business Profile. Out of scope: CSP, self-hosted fonts, image CDN.
- [ ] **Step 5:** `npm test`, commit `seo: audit document, redirects, headers, robots, internal links`.

### Task 12: Guides and README

**Files:** Create `DEPLOY.md`, `CONTENT.md`; Modify `README.md`; Move `FORM_FIX_REPORT.md`, `SEO_AUDIT_REPORT.md` → `docs/archive/`.

- [ ] **Step 1:** Invoke `engineering:documentation`. Write `DEPLOY.md` for someone who has never used Git: what Git, GitHub, a branch and Netlify are in one paragraph each; the two-minute check to see whether Netlify is connected to GitHub (Netlify → Site configuration → Build & deploy → Continuous deployment: if it shows the GitHub repo it is connected; if it says "Deploy manually" it is not) and how to connect it; exact settings: Build command `npm run build`, Publish directory `_site`, Node 22 (already in `netlify.toml` so the dashboard can be left blank); what happens on push to main and on a branch (Deploy Previews, where the link appears); how to preview before going live (open a pull request, wait for the Netlify bot comment); Forms: enable form detection, add the email notification (exact clicks), where submissions and uploaded CVs appear, the 100 submissions a month free limit and 10 MB upload limit [VERIFY current Netlify limits]; rolling back (Deploys → pick an earlier deploy → Publish deploy); when the build fails (open the deploy log, read the line starting with ✗, fix that file).
- [ ] **Step 2:** `CONTENT.md`: for each of adding a blog post, adding a case study, adding a job advert (with the Health Workforce Locator steps and setting `classification_checked`), marking a job filled or closed, updating a last verified date (per post and in `regulatory.json`), and what to do when it does not work: the GitHub web route (Add file → paste template → commit to new branch → Propose changes → wait for preview → Merge) and the local route with copy-paste commands (`git pull`, edit, `git add`, `git commit -m`, `git push`). Every code block tagged `bash`, one command per block. Include the validator's message format and the three most likely errors.
- [ ] **Step 3:** README.md rewritten to point at CLAUDE.md, DEPLOY.md, CONTENT.md; remove the "no build step" claims and the Python image recipe stays. Archive the two old reports. Commit `docs: DEPLOY.md, CONTENT.md, README refresh, archive old reports`.

### Task 13: Verification before completion

- [ ] **Step 1:** Invoke `superpowers:verification-before-completion`. Run `npm test` from clean (`rm -rf _site node_modules && npm ci && npm test`). Serve `_site` and walk every page in the browser at mobile and desktop; read console for errors; confirm the nav, both forms, the jobs listing empty state, the contact prefill, and the 404.
- [ ] **Step 2:** Push the branch. If Netlify is connected, open a PR (not merge) so a Deploy Preview builds; read the deploy log; submit a test entry to each of the three forms on the preview URL with obviously test data ("TEST Claude 14 Sep") including a small PDF for the CV; ask Faisal to confirm in Netlify → Forms that three submissions arrived and the email notification fired. If Netlify is not connected, state plainly that the forms are verified only in local rendering and that the live check happens right after he connects the repo, with the exact steps.
- [ ] **Step 3:** Report faithfully: what is verified, what is not, what needs Faisal.

### Task 14: Code review and final report

- [ ] **Step 1:** Invoke `superpowers:requesting-code-review` (or `engineering:code-review`) on the branch diff against `main`. Fix findings; `npm test`; commit.
- [ ] **Step 2:** Final message to Faisal: what is done and verified, what he must click in Netlify, the `[VERIFY]` list, and the Task 7 judgement (from the Design section, updated with anything learnt).

---

## Verification (end-to-end)

1. `npm test` green on a clean checkout.
2. Browser pass over `_site` via the preview server: every nav item, both forms validate and post (local server answers 501 to POST, which is expected), jobs empty state, contact prefill, 404, thank-you.
3. Netlify Deploy Preview builds from the branch; three test submissions visible in the Forms tab; notification email received (Faisal confirms).
4. Google Rich Results Test on a job page and a post page from the preview URL (Faisal or Claude via browser).
5. Search Console: nothing to do until merge; sitemap URL unchanged.
