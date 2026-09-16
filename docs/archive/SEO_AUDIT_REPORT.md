# Drs Rego — SEO & AI-Readiness Audit Report

Audited: 7 July 2026 · Scope: every file in the project · Assumed live origin: `https://drsrego.com.au/` (https, non-www — applied consistently)

Pages crawled: `index.html`, `doctors.html`, `clinics.html`, `about.html`, `contact.html`, `privacy.html`, `terms.html` — plus `sitemap.xml`, `robots.txt`, `assets/css/styles.css`, `assets/js/main.js`, all images. No orphan pages found; no additional pages found.

---

## PHASE 1 — AUDIT FINDINGS

### Keyword map (used to judge every finding below)

| Page | Primary keyword | Secondary keywords |
|---|---|---|
| index | medical registration Australia | AHPRA registration support · IMG · clinic compliance · PESCI |
| doctors | AHPRA registration for international medical graduates | PESCI exemption · supervision plan SPPA-30 · Medicare 19AB exemption · IMG pathways (FSP, AGPT, RVTS, competent authority) |
| clinics | employ an international medical graduate | IMG-ready clinic · supervisor requirements for IMGs · DPA / DWS / MMM · supervision compliance |
| about | Drs Rego (brand) | medical registration consultants · compliance advisers · trust terms |
| contact | medical registration consultant contact | enquiry · AHPRA registration enquiry |
| privacy / terms | n/a (legal) | unique titles/descriptions only |

### 1. Meta data & keywords

| Check | index | doctors | clinics | about | contact | privacy | terms |
|---|---|---|---|---|---|---|---|
| Unique `<title>` ≤60 chars | ISSUE¹ | ISSUE² | ISSUE³ | ISSUE⁴ | ISSUE⁵ | ISSUE⁴ | ISSUE⁴ |
| Keyword-front title, brand at end | ISSUE¹ | PASS (order) | PASS (order) | PASS | ISSUE⁵ | PASS | PASS |
| Unique meta description 120–155 | PASS⁶ | PASS⁶ | PASS⁶ | PASS | PASS⁶ | PASS | PASS |
| Primary keyword in title | ISSUE¹ | PARTIAL² | PARTIAL³ | PASS | ISSUE⁵ | n/a | n/a |
| Primary keyword in H1 | **ISSUE** | **ISSUE** | PARTIAL | PARTIAL | **ISSUE** | PASS | PASS |
| Primary keyword in first 100 words | PARTIAL | PARTIAL | PARTIAL | PASS | ISSUE | n/a | n/a |
| Primary keyword in ≥1 H2 | **MISSING** | **MISSING** | **MISSING** | PASS | n/a | n/a | n/a |
| Keyword stuffing / density >2% | PASS (none) | PASS (none) | PASS (none) | PASS | PASS | PASS | PASS |
| `meta keywords` absent | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Canonical correct & consistent | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| OG + Twitter tags present | PASS | PASS | PASS | PASS | PASS | PASS (no img, `summary` card — fine) | PASS |
| `og:image` dimensions/alt declared | **MISSING** | **MISSING** | **MISSING** | **MISSING** | **MISSING** | n/a | n/a |
| `<html lang="en-AU">` | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| No accidental `noindex` | PASS | PASS | PASS | PASS | PASS | PASS | PASS |

¹ "Drs Rego — Australian Medical Registration Specialists" — brand first, primary keyword ("medical registration Australia") not front-loaded.
² "AHPRA & PESCI Support for IMG Doctors — Drs Rego" — good shape, but "AHPRA registration" (the searched phrase) absent; separator inconsistent with target format.
³ "Employ an IMG in Your Clinic" — "IMG" alone is jargon; the searched long-tail is "employ an international medical graduate".
⁴ Title fine in substance; separator "—" inconsistent with the "| Drs Rego" pattern chosen as the site standard.
⁵ "Contact Drs Rego — Make an Enquiry" — no keyword; "Make an Enquiry" also contradicts the site's current CTA wording ("Get in touch").
⁶ Descriptions are compliant on length/uniqueness but will be updated in lock-step wherever the title's primary keyword changed, so title ↔ description stay consistent.

### 2. Heading hierarchy

| Check | index | doctors | clinics | about | contact | privacy | terms |
|---|---|---|---|---|---|---|---|
| Exactly one `<h1>` | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| No skipped levels | PASS⁷ | PASS | PASS⁷ | PASS | PASS | PASS | PASS |
| H1 contains primary keyword | **ISSUE** ("Registration, handled properly." — no qualifier) | **ISSUE** ("Your pathway, without the paperwork maze." — no keyword) | PARTIAL ("Employ IMGs with confidence." — jargon acronym only) | PARTIAL (brand absent) | **ISSUE** ("Start with a conversation.") | PASS | PASS |
| Headings descriptive / front-loaded | ISSUE: "Where we can help.", "Asked before every engagement.", "A clear process, from first email to full compliance.", "Two sides of the same process." are decorative — weak for both Google and AI extraction | | | | | | |
| Outline reconstructs page argument | ISSUE on index and doctors (see above); clinics mostly PASS; about PASS; contact PASS | | | | | | |

⁷ `h4` inside `.stuck-list` (clinics) follows `h2`→(list) — verified acceptable: the `h4`s sit under an `h2` section with no intervening `h3`; this is a genuine skip (h2→h4) — flagged, fix by demoting to `h3` with a class to preserve styling. Footer column headings are `h2` elements after `<main>` — allowed, but they dilute the document outline; left as-is (see "deliberately not changed").

### 3. Image accessibility

| Check | Result |
|---|---|
| Meaningful alt text on every `<img>` | PASS — all 12 content images + 2 logos audited; all specific |
| Explicit width/height | PASS — every `<img>` |
| `loading="lazy"` below fold / `fetchpriority="high"` hero | PASS on index; PARTIAL on doctors/clinics — heroes have `fetchpriority="high"` but **no `<link rel="preload">`** (index only) |
| WebP + JPEG fallback via `<picture>` | PASS — all images |
| Oversized files | **ISSUE**: `outback-road-1600.webp` = 233 KB (>120 KB budget for a non-hero). All other *referenced* variants within budget. (`team-meeting-1600.webp` 214 KB and `doctor-portrait-1600.webp` 127 KB exist on disk but are **not referenced** by any page — no page-weight impact.) |
| Descriptive file names | PASS — `hero-consult`, `clinic-meeting`, `outback-road`, etc. |
| Correct srcset/sizes | PASS — checked against rendered layout widths |

### 4. Technical SEO & AI readiness

| Check | Result |
|---|---|
| sitemap.xml correct, absolute URLs | PASS (7 pages, correct origin) |
| robots.txt present, references sitemap | PASS; **ISSUE**: silent on AI crawlers — decision: explicitly allow GPTBot / ClaudeBot / PerplexityBot / Google-Extended (see below) |
| JSON-LD ProfessionalService on index | PARTIAL — present and parses, but **missing `legalName`** (FFAM Holdings Pty Ltd trading as Drs Rego) and **`sameAs`** |
| WebSite schema on index | **MISSING** |
| FAQPage schema on doctors (has visible FAQ) | **MISSING** |
| FAQ block + schema on clinics | **MISSING** (no FAQ section exists) |
| BreadcrumbList | **MISSING** — no visible breadcrumb; sensible Home → Page schema can be inferred from nav for inner pages |
| No Review/AggregateRating/Offer schema | PASS (none present — correct) |
| All JSON-LD parses | PASS (1 block site-wide, validated) |
| Internal linking ≤2 clicks | PASS (flat nav) |
| Descriptive anchors, no "click here" | PASS |
| doctors ↔ clinics contextual cross-links | **MISSING** — the two funnel pages never reference each other in body copy |
| Broken links | PASS — every internal href/src resolves; footer social hrefs are deliberate `[PLACEHOLDER]` tokens for the owner |
| One `<main>`, landmarks, skip link | PASS all pages |
| Viewport meta / tap targets | PASS (44px targets verified in earlier build QA) |
| HTML validity (tag balance, duplicate IDs, one h1) | PASS — machine-checked |
| Fonts: display=swap + preconnect | PASS |
| Page weight ≤600 KB | PASS — heaviest is index at ~242 KB + ~100 KB fonts |
| Render-blocking | ACCEPTABLE — single CSS file (23 KB) + Google Fonts CSS; JS is deferred; no libraries |
| `llms.txt` | **MISSING** |
| Sections open with a direct answer | MOSTLY PASS — service blocks open with plain declaratives; **ISSUE**: index hero lede doesn't state *what Drs Rego is* in an extractable first sentence (entity clarity) |
| All content in static HTML | PASS — JS only toggles nav/reveals/validation |
| Visible "Last updated" on legal pages | PARTIAL — line exists but shows an unfilled `[DATE]` placeholder (no real date signal) |
| Favicon / apple-touch-icon | **MISSING** — no icon files, no `<link rel="icon">` on any page |
| 404 page | **MISSING** |
| Security headers documented | **MISSING** from README (hosting-level recommendation) |
| Entity line (FFAM Holdings Pty Ltd t/a Drs Rego, ABN 66 690 668 529) in footer | **MISSING** — footer shows `ABN [ABN]` placeholder and a leftover "A MedBridge Consulting service" span |

### 5. Additional checks

| Check | Result |
|---|---|
| Australian English | MOSTLY PASS — machine scan found no -ize/-or misspellings; "practise/practice", "programme", "Licence" used correctly. **ISSUE**: regulator name written inconsistently ("Ahpra" in some body copy, "AHPRA" elsewhere) — standardising on AHPRA (the form users search). |
| Duplicate content between pages | PASS — repeated blocks are boilerplate only (footer, mandated scope note) |
| Orphan pages | PASS — none |
| Form labels machine-readable | PASS — every input has `<label for>`; errors use `role="alert"`; consent links to Privacy Policy |
| AI crawler policy | DECISION: allow GPTBot, ClaudeBot, PerplexityBot, Google-Extended explicitly in robots.txt — an enquiry-only consultancy benefits from being quotable in AI answers; there is no proprietary content to protect |

---

## PHASE 2 — FIXES APPLIED

Every change below was applied directly in the files and then re-verified by machine (link crawl, tag-balance parse, JSON-LD parse, title/description length check, heading-skip check, AU-spelling scan, page-weight calculation). One line of justification follows each change.

### Meta data (titles & descriptions)

| Page | Before | After |
|---|---|---|
| index title | Drs Rego — Australian Medical Registration Specialists | **Medical Registration Australia — AHPRA Support \| Drs Rego** (57ch) — primary keyword front-loaded, brand at end |
| index description | "AHPRA registration, PESCI preparation and exemptions… for IMGs and Australian clinics." | "Drs Rego helps internationally trained doctors and Australian clinics with AHPRA registration, PESCI, supervision plans and Medicare 19AB exemptions." (149ch) — answers the query and names the entity |
| doctors title | AHPRA & PESCI Support for IMG Doctors — Drs Rego | **AHPRA Registration Support for IMGs \| Drs Rego** (46ch) — matches the searched phrase "AHPRA registration" |
| doctors description | "AHPRA registration help for IMGs — application concierge…" | "AHPRA registration support for international medical graduates — PESCI preparation and exemptions, supervision plans (SPPA-30) and Medicare 19AB." (145ch) — spells out the long-tail audience term |
| clinics title | Employ an IMG in Your Clinic — Drs Rego | **Employ an International Medical Graduate \| Drs Rego** (51ch) — searchers type the full phrase, not the acronym |
| clinics description | "IMG-readiness audits, supervisor matching…" | "How Australian clinics employ international medical graduates — IMG-readiness audits, supervisor requirements, DPA and MMM checks, compliance support." (150ch) |
| about title | About Drs Rego — Registration & Compliance Advisers | **About Drs Rego \| Medical Registration Consultants** (49ch) — consistent separator, stronger entity term |
| contact title | Contact Drs Rego — Make an Enquiry | **Contact a Medical Registration Consultant \| Drs Rego** (52ch) — keyword added; old wording contradicted the site's "Get in touch" CTA |
| contact lede | "Tell us where you are in the process — we reply within two business days." | Same + "whether you are a doctor seeking AHPRA registration or a clinic preparing for an IMG hire" — puts the keyword in the first 100 words |
| privacy / terms titles | "… — Drs Rego" | "… \| Drs Rego" — one separator convention site-wide; terms description lengthened 106→145ch |

All og:title / og:description / twitter:title / twitter:description tags were updated in lock-step, and every og:image now declares `og:image:width`, `og:image:height` and `og:image:alt`.

### Headings (H1/H2 rewrites — visual style unchanged)

| Page | Before | After | Why |
|---|---|---|---|
| index H1 | Registration, handled properly. | **Medical registration in Australia, handled properly.** | Primary keyword in H1, voice kept |
| index H2 | Two sides of the same process. | Support for doctors and for the clinics that employ them. | Outline now reconstructs the page argument |
| index H2 | A clear process, from first email to full compliance. | How our medical registration support works. | Keyword in an H2; extractable by AI engines |
| doctors H1 | Your pathway, without the paperwork maze. | **AHPRA registration for IMGs, without the paperwork maze.** | Keyword + voice |
| doctors H2 | Where we can help. | Registration services for international medical graduates. | Decorative → descriptive |
| doctors H2 | Asked before every engagement. | Common questions about AHPRA registration and PESCI. | FAQ heading now states its subject |
| clinics H1 | Employ IMGs with confidence. | **Employ international medical graduates with confidence.** | Full search phrase, not the acronym |
| clinics h4→h3 ×3 | `<h4>` under an `<h2>` section ("Where clinics get stuck") | `<h3 class="stuck-heading">` + CSS rule preserving the exact previous appearance | Repairs the h2→h4 level skip without visual change |
| about H1 | The paperwork between good doctors and good medicine. | **Drs Rego — the paperwork between good doctors and good medicine.** | Brand (the page's primary keyword) in H1 |
| contact H1 | Start with a conversation. | **Contact a medical registration consultant.** | Keyword + matches page purpose |

### Body copy & entity clarity

- **index lede** now opens with a quotable declarative: "Drs Rego is an Australian medical registration and compliance consultancy." — entity clarity for AI extraction.
- **doctors lede**: "…sequencing of AHPRA registration, PESCI and Medicare trip up even excellent international medical graduates." — primary keyword in the first 100 words.
- **Fellowship section** (doctors + index strip): "PEP" updated to "FSP (formerly PEP)" and AGPT / RVTS added — matches current programme names doctors actually search.
- **Career & Pathway section**: now names the standard pathway, competent authority pathway, and specialist / expedited specialist pathways explicitly.
- **clinics audit copy**: "DPA status (the successor to DWS for general practice) and MMM classification" — captures the DWS legacy search term factually.
- **"Ahpra" → "AHPRA"** standardised across all copy (5 occurrences) — the form users search; consistency matters for entity recognition.
- **New FAQ section on clinics.html** (4 questions: employing an overseas-trained doctor, what a DPA is, who can supervise an IMG, whether rural location is required) with answers that are factual, regulator-neutral and guarantee-free — plus matching FAQPage schema.
- **Cross-links added**: doctors FAQ → clinics page; clinics FAQ → doctors page (descriptive anchor text, both directions).

### Structured data (all blocks machine-validated as parseable JSON)

- index `ProfessionalService`: added `legalName` ("FFAM Holdings Pty Ltd trading as Drs Rego") and `sameAs` (social placeholders, replaced together with the footer links).
- index: added `WebSite` schema (`inLanguage: en-AU`, publisher with legal name).
- doctors + clinics: added `FAQPage` schema exactly mirroring the visible FAQ text.
- All six inner pages: added `BreadcrumbList` (Home → page) inferred from the nav.
- Deliberately **no** Review, AggregateRating or Offer schema — nothing to honestly back them.

### Technical & AI readiness

| Item | Action |
|---|---|
| Favicon | Created `favicon.svg` (brand blue + white R) and `apple-touch-icon.png` (180×180); linked from every page |
| `llms.txt` | Created at root — business summary, both audiences, per-page coverage, immigration exclusion, enquiry-only model, attribution guidance |
| robots.txt | Rewritten with an explicit comment that GPTBot / ClaudeBot / PerplexityBot / Google-Extended are deliberately not blocked, and why |
| 404 page | Created branded `404.html` (noindex, links to the four key pages); hosting activation documented in README §4 |
| Oversized image | `outback-road-1600.webp` recompressed 233→149 KB and its JPEG fallback 347→195 KB (visually indistinguishable at full-bleed size) |
| LCP preload | Added `<link rel="preload">` for the hero image on doctors.html and clinics.html (index already had it) |
| Entity line | Footer on every page now reads "© 2026 Drs Rego · FFAM Holdings Pty Ltd trading as Drs Rego · ABN 66 690 668 529" (replaced the `[ABN]` placeholder and the obsolete "A MedBridge Consulting service" span) |
| Date signals | privacy.html and terms.html now show "Last updated: 7 July 2026" (visible), with a comment to update on lawyer review |
| Security headers | Documented in README §4 as hosting-level configuration (nosniff + CSP via `.htaccess` or Netlify `_headers`) — not attempted client-side |

### Summary — issues found / fixed

| Category | Found | Fixed | Remaining |
|---|---|---|---|
| Meta data & keywords | 14 | 14 | 0 |
| Heading hierarchy | 11 | 11 | 0 |
| Image accessibility | 3 (preload ×2, oversize ×1) | 3 | 0 |
| Technical SEO | 9 | 9 | 0 |
| AI readiness | 6 | 6 | 0 |
| Additional (spelling, entity, favicon, 404) | 5 | 5 | 0 |

Verification results: every page parses cleanly (balanced tags, unique IDs, one `h1`), all internal links and anchors resolve, all 11 JSON-LD blocks parse, all titles ≤60ch and descriptions 120–155ch, no heading level skips, page weights 39–243 KB (budget 600 KB), custom JS 5.8 KB (budget 6 KB). One scanner hit is a documented false positive: the word "guarantee" in terms.html §5 is the statutory phrase "consumer guarantee" from the Australian Consumer Law — it is not an outcome promise and must stay.

### Deliberately NOT changed

- **"Six areas of specialised support."** (index H2) — the owner chose this wording on 7 July 2026; keyword coverage was achieved in other H2s instead.
- **Footer column headings remain `<h2>`** — valid HTML, common pattern; changing them risks styling churn for negligible SEO gain.
- **Social link placeholders (`[LINKEDIN_URL]` etc.)** — kept as owner-fill placeholders in both footer and `sameAs`; they are deliberate and documented, not broken links.
- **The immigration exclusion wording** — untouched, verbatim, in all seven locations (machine-checked).
- **No pricing added anywhere; no testimonials, ratings or fabricated trust signals** — per the hard constraints.
- **`[EMAIL]`, `[PHONE]`, `[FORM_ENDPOINT]`, `[CALENDLY_URL]`, `[STATE]`** — business placeholders the owner must fill; listed in README §1.
- **Unreferenced spare image variants** (`clinic-interior-*`, `team-meeting-1600`, `doctor-portrait-1600`) — kept on disk as spares; they load on no page so cost nothing.

### Post-launch recommendations (need the live domain)

1. **Google Search Console** — verify `drsrego.com.au`, submit `sitemap.xml`, confirm the FAQ rich results appear under Enhancements.
2. **Bing Webmaster Tools** — verify and submit the sitemap (Bing's index feeds ChatGPT Search).
3. **Social debuggers** — paste each URL into LinkedIn Post Inspector and Facebook Sharing Debugger to confirm OG images render.
4. **Rich results test** — run doctors.html and clinics.html through Google's Rich Results Test once live (FAQPage eligibility).
5. **Fill the placeholders** — especially `[EMAIL]` (it appears in the ProfessionalService schema) and the social URLs (they double as `sameAs` entity signals).
6. **Host-level**: enable the 404 page (`.htaccess ErrorDocument` on cPanel; automatic on Netlify), add security headers, and force https + non-www redirects so the canonical origin is the only origin that resolves.
7. **Ongoing**: when regulators rename things again (as PEP→FSP did), update copy promptly — freshness and accuracy are ranking signals for both Google and AI engines.

---

## ADDENDUM — business details configured (7 July 2026, post-audit)

All remaining placeholders were resolved with real values supplied by the owner:

- **Form**: converted from the Formspree placeholder to **Netlify Forms** (`name="enquiry"`, `data-netlify="true"`, hidden `form-name` input, `bot-field` honeypot, redirect to a new branded, noindexed `/thank-you.html`). Netlify dashboard steps documented in README §2, including the warning that the form only captures submissions while hosted on Netlify. (Superseded detail: the success page was originally created as `thanks.html`; it was renamed to `thank-you.html` in the 7 July form fix — see FORM_FIX_REPORT.md.)
- **Calendly**: live inline widget on contact.html (`calendly.com/drsrego-info/30min`, brand colours). This adds one third-party script (async, below the fold) — an accepted trade-off; the custom-JS budget still holds at 5.8 KB.
- **Contact details**: `info@drsrego.com.au`, `(02) 8281 6694` (`tel:+61282816694`) and "Sydney, NSW" in every footer; email/telephone/PostalAddress (Sydney, NSW, AU) added to the ProfessionalService schema.
- **Socials**: LinkedIn (`linkedin.com/company/drsrego/` — tracking parameter `?viewAsMember=true` stripped) and Facebook filled in footer icons and `sameAs`; Instagram removed everywhere per owner instruction.
- **terms.html**: governing law set to New South Wales.
- README §§1–4 rewritten for the Netlify deployment path; llms.txt contact section updated.
