# Pull request: photos, analytics, supervisor form and the verification page

Open the PR here: https://github.com/Ammsyd/drsrego-website/compare/main...feature/photos-analytics-supervisors?expand=1

## Title

Photos, analytics, supervisor form and the DPA verification page

## Body

### What changed

**Two new pages**

- **`/how-we-verify/`**: explains how we check DPA and MMM before shortlisting, in four steps, with every claim sourced to health.gov.au and dated. It also states plainly what a verified classification does **not** mean: not a guarantee, not an exemption, not a registration outcome, not immigration advice. This is the trust asset behind the jobs board's differentiator.
- **`/supervisor-interest/`**: a fourth Netlify form for vocationally registered GPs who can supervise. Supervision capacity is the most common reason a hire stalls, and until now the site had no way for supervisors to put their hand up. Same pattern, honeypot, consent wording and unsubscribe path as the other forms.

**Analytics, switched off until you want it**

- Google Analytics 4 is wired into the base layout but renders nothing while `analyticsId` is empty in `src/_data/site.json`. Paste a Measurement ID to switch it on.
- A `cta_click` event records which call to action was used and where it sat (eligibility block, Ask us band, job page, jobs empty state). That answers the question the site could not previously answer: does "Ask us" actually convert.
- The privacy policy now describes what analytics collects, in plain words, including that IP addresses are shortened.

**Photos**

- Hero photos added to the jobs listing, the insights listing and all three form pages, plus the two new pages.
- Four new Unsplash photos, each checked visually before use: `gp-consult-room` (jobs), `gp-at-desk` (request a doctor), `doctor-desk-certificates` (insights) and `clinicians-review` (supervisor). All free-licence and recorded in `CREDITS.txt`. The earlier choices were replaced after review: one showed a dental surgery and the others looked dated.
- Hero photos are now cropped to a consistent shape (3:2 on desktop, 16:9 on mobile), the same treatment the homepage funnel cards already used. Without it a portrait photo pushed the register-your-interest form 1477px down a phone screen.
- **Job advert pages deliberately carry no photo.** A stock image on a specific vacancy implies a practice we are not actually showing.

**Smaller things**

- The supervisor form is now linked from the practices page in three places (jump list, supervisor matching section, request-a-doctor band), not only the footer.

- "Template for review: have this checked by your lawyer" removed from the privacy and terms pages.
- A "Go straight to the form" link on each form page, for people who do not need the preamble.
- `docs/SKILLS-PROMPT.md`: a prompt to paste into the Drs Rego project chat that builds two content skills, one for website content by type and one for job adverts, each producing the markdown file plus a LinkedIn company caption plus a personal repost caption plus an image brief.
- CONTENT.md gains a section on adding photos (sources, licence, the resize command, alt text rules) and a section on how to ask for a change.
- DEPLOY.md, CLAUDE.md and SEO-AUDIT.md updated for the fourth form, the analytics decision and the Google Business Profile finding (a listing already exists and should be claimed).

### Why

Three of these came off the "worth building" list after the first release: analytics, the verification page and the supervisor form. The photos and the lawyer-notice removal were requested directly.

### For the reviewer

- `npm ci && npm test` should print Content OK and Site OK across 15 pages.
- Nothing is published that was not already: the three Insights posts and the example job remain drafts.
- After merging, the new `supervisor-interest` form appears in Netlify â†’ Forms on first submission. The existing email notification hook already covers all forms, so no new setup is needed.
- Analytics stays dormant until a Measurement ID is added.

ðŸ¤– Generated with [Claude Code](https://claude.com/claude-code)

