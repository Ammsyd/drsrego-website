# Drs Rego: Recruitment, Jobs and Insights Design Spec

Written 14 September 2026. Implemented by the plan in ../plans/.

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

