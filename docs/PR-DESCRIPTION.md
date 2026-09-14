# Pull request: Recruitment, jobs board and Insights (Eleventy build)

Open the PR here: https://github.com/Ammsyd/drsrego-website/compare/main...feature/recruitment-jobs-insights?expand=1

Paste the title and body below.

## Title

Recruitment, jobs board and Insights: Eleventy build with preserved URLs

## Body

### What changed

- **Eleventy build.** The site is now generated from `src/` into `_site/`. One shared layout, header and footer replace the copies pasted into nine pages. `netlify.toml` sets build command `npm run build` and publish directory `_site` (Node 22). Pretty URLs stay on.
- **Every existing address is unchanged** (`/doctors.html`, `/clinics.html`, `/about.html`, `/contact.html`, `/privacy.html`, `/terms.html`, `/thank-you.html`, `/404.html`). Nothing indexed moves; no redirects needed. The sitemap is now generated.
- **Navigation** split into For Doctors, For Practices, Jobs, Insights, About, Contact, with in-page jump lists on the two audience pages. Home is the logo on desktop and a menu item on phones.
- **Jobs board** at `/jobs/`. One markdown file per role in `src/jobs/`. Every job page renders an eligibility block stating MMM category, DPA status and the date checked, who the role suits under section 19AB, sources with last-verified dates, and a prominent "Ask us" button (the main conversion). Open roles carry JobPosting structured data; filled and closed roles keep a useful page, drop the structured data, and leave the sitemap and listing. Client-side filters by state, type and 19AB suitability. Honest empty state (no invented adverts).
- **Two Netlify forms.** Register your interest (doctors, with CV upload and the required consent wording verbatim) at `/register-your-interest/`, and Request a doctor (practices, street address mandatory with the DPA catchment helper text) at `/request-a-doctor/`. Both carry privacy links and an unsubscribe path. Contact form gains hidden `topic` and `job` fields and prefills from "Ask us" links.
- **Insights** at `/insights/`. Markdown posts with For doctors / For practices categories, case studies as a post type, last-verified date on every post, sources list, Article structured data, Open Graph article tags and a default 1200×630 share image. Three starter posts are included as drafts with `[VERIFY: …]` markers.
- **Content compliance sweep.** All em dashes removed; outcome-flavoured phrases rewritten; About and practices pages now describe compliance-first recruitment; every regulatory FAQ answer cites health.gov.au or medicalboard.gov.au with a last-verified date, driven by `src/_data/regulatory.json`.
- **Safety net.** `scripts/validate-content.js` runs before every build and fails the deploy with a plain-English message for missing fields, bad status values, em dashes, unresolved `[VERIFY]` markers in published files, dollar amounts, or the wrong department name. `scripts/check-site.js` checks the built pages for broken links, missing alt text, heading problems and duplicate titles. `npm test` runs both.
- **Accessibility and design pass** on the nav, jobs, insights and both forms (labels, described-by links, focus, 44px targets, 200% zoom, mobile hierarchy).

### Why

Recruitment is now a service. The differentiator is stating DPA and MMM with a verification date on every advert, which no other board does. The build step makes that maintainable from markdown files instead of hand-edited HTML.

### For the reviewer

- Run `npm ci && npm test`. Both checks should print OK across 13 pages.
- `src/jobs/example-role.md` and the three posts are `draft: true` on purpose; they never publish until markers are resolved.
- Still to land on this branch: `SEO-AUDIT.md`, `DEPLOY.md`, `CONTENT.md`, a README refresh, live form verification on a Netlify deploy preview, and a code review pass.
- After merging, Netlify needs: form detection enabled, email notifications for the three forms, and (if not already) the repository connected for continuous deployment. DEPLOY.md will spell out the clicks.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
