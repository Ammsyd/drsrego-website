# Prompt: create the two content skills

Copy everything between the lines below and paste it into your Drs Rego project chat on claude.ai. It asks Claude to build two new skills that sit alongside the ten you already have.

Before you paste it, make sure these files are in the project (upload them if they are not): `CLAUDE.md`, `CONTENT.md`, `SEO-AUDIT.md`, `templates/job.md`, `templates/post.md`, `templates/case-study.md`, and `src/_data/regulatory.json`. They are all in the website repository at github.com/Ammsyd/drsrego-website.

---

I want you to create two new skills for the Drs Rego content operation. Read this whole brief before you start, then build both skills.

## Background you need

Drs Rego is an Australian medical registration, compliance and GP recruitment consultancy. Two audiences: internationally trained doctors (IMGs) seeking Australian registration, and Australian general practices that employ them. The website is drsrego.com.au, built with Eleventy, and its source lives at github.com/Ammsyd/drsrego-website.

Website content is plain text files. A blog post or case study is one markdown file in `src/insights/`. A job advert is one markdown file in `src/jobs/`. Each file starts with a settings block between two `---` lines, then the article in markdown. `CONTENT.md` in the project explains the whole workflow, and `templates/post.md`, `templates/case-study.md` and `templates/job.md` are the exact shapes to fill in. Read all four before you design the skills.

I run this part-time, five to eight hours a week. Anything fiddly will not get maintained.

## Skills that already exist (do not duplicate them, chain to them)

- **drsrego-linkedin-intel**: daily scan of Australian registration, compliance and workforce news. This is where topic ideas come from.
- **drsrego-content-ideas**: weekly scored shortlist of post ideas.
- **drsrego-post-writer**: writes LinkedIn posts in two voices, the company page and my personal profile.
- **drsrego-repost-caption**: writes my personal repost caption for a company post.
- **drsrego-content-check**: final compliance gate before anything is published.
- **drsrego-source-verify**: quarterly re-verification of regulatory facts.
- **drsrego-content-ops**: owns the content calendar and the visual asset register.
- **drsrego-card-design** and **drsrego-carousel-design**: branded LinkedIn visuals.
- **drsrego-video-scripts**: phase two, not active yet.

The two new skills produce **website** content, which none of the existing skills do. They must hand off to the existing ones rather than reimplement them: use drsrego-linkedin-intel and drsrego-content-ideas as sources of topics, follow the voice rules in drsrego-post-writer for the captions, use drsrego-repost-caption's rules for the personal caption, log the result with drsrego-content-ops, and always end by running drsrego-content-check.

## Hard content rules (these are compliance requirements, not style preferences)

Copy these into both skills verbatim. They are also in `CLAUDE.md`.

1. No pricing anywhere. Enquiry-only. No ranges, no indication.
2. No outcome guarantees and no turnaround times. Never "takes 8 weeks", never "we get you registered". Ahpra, the AMC, the Colleges and Medicare decide.
3. No immigration or visa advice. If visas or sponsorship come up: "referred to a registered migration agent".
4. No regulatory fact without a source and a date. Anything about DPA, MMM, section 19AA, section 19AB, PESCI or supervision links to health.gov.au, ahpra.gov.au or medicalboard.gov.au and carries a last-verified date. If unsure, write `[VERIFY: what needs checking]` and stop. Do not guess and do not fill gaps from memory. The current source list is `src/_data/regulatory.json`.
5. No em dashes. Use commas, colons or full stops.
6. Australian English: organisation, specialise, programme, practise (verb).
7. The department is the **Department of Health, Disability and Ageing**, never "Health and Aged Care".
8. Never invent a job, a practice, a doctor, a testimonial or a case study.

The website has an automatic checker that refuses to publish a file breaking rules 4, 5, 7 or containing a dollar amount, so getting these right saves me a failed deploy.

## My voice

Direct, practical, no hype. Short sentences. Lead with the answer, then explain. I would rather say "no" in one word and spend the rest of the piece on why, than build up to a reveal. No marketing language, no "unlock", no "game-changer", no rhetorical questions as openers. I am comfortable saying "I do not know, here is how to find out".

---

# Skill 1: drsrego-web-content

**Purpose:** turn a topic into a finished website article plus its LinkedIn launch, in one pass.

**Trigger:** when I say "write an insight", "new post", "write this up for the site", "turn this into an article", or hand you a topic from the weekly shortlist.

## Content types it must support

Ask me which type, or infer it and say which you chose:

1. **Regulatory explainer** (most common). Explains one mechanism plainly: what it is, who it applies to, what to do. Goes in `src/insights/`, category `doctors` or `practices`. Examples that already exist: "19AA and 19AB explained", "Does fellowship end my 10-year moratorium?", "How to check whether your practice is in a DPA catchment".
2. **Regulatory update.** Something changed: an annual DPA update, a new form version, a college criteria change. States what changed, from when, who it affects, and what to do now. Always cites the regulator page and the date. Shorter than an explainer, 400 to 600 words.
3. **Practice guide.** Practices-facing, procedural, usually a numbered process with a checklist. "What to have ready before your first IMG hire", that sort of thing.
4. **Case study.** Uses `templates/case-study.md`. Anonymised: no doctor names, no practice names, no towns small enough to identify anyone. Outcomes stated plainly ("registration was granted"), never "we got them registered", never how long a regulator took. Requires my written confirmation that the people involved have agreed, and you must ask for it before drafting.
5. **Question answer.** A single sharp question doctors actually ask, answered in 300 to 500 words. Good for the questions that come in by email twice a week.

## What it must produce, every time, in one document

1. **The markdown file**, complete and ready for me to paste into GitHub. Full settings block: title, description under 160 characters, date, last_verified, category, type, sources (each with label, url, verified date), related (links to service sections such as `/doctors.html#medicare` or `/clinics.html#audit`), draft: true. Suggest the file name in lowercase with hyphens, since that becomes the web address.
2. **Every regulatory claim either sourced or marked** `[VERIFY: ...]`. List the markers at the top of your reply so I can see what I need to check before publishing.
3. **A LinkedIn caption for the Drs Rego company page.** Follow drsrego-post-writer's company voice. It must stand alone as a useful post, not a "we wrote a thing" teaser, and end with a link to the article.
4. **A personal repost caption for me.** Follow drsrego-repost-caption's rules: add something new, never cheerlead. Usually the reason I wrote it, or the case that prompted it.
5. **An image brief**: what the picture should show, a suggested alt text, and a search term for Unsplash or Pexels. See the image section below.
6. **Internal links**: at least two links to service sections on the site, and one to another Insights article where a relevant one exists.

## Extras

- Suggest the SEO title and meta description separately if they differ from the article title.
- Flag when a topic is better as a job advert, a LinkedIn-only post, or a card, and say why.
- End by telling me to run drsrego-content-check on the draft, and to log it with drsrego-content-ops.

---

# Skill 2: drsrego-job-ad

**Purpose:** turn the details of a real vacancy into a finished advert for the website plus its LinkedIn launch.

**Trigger:** when I say "new job", "write this advert", "add this role", or paste practice details.

## What it must do first, before drafting anything

Ask me for these, and refuse to draft until it has them:

- The practice's **full street address**, including postcode. Not the suburb. DPA is set by GP catchment and a boundary can run down a road.
- The **MMM category** (1 to 7) and **DPA status** (yes or no) from the Health Workforce Locator, and **the date I checked them**.
- Whether **vocational registration** is required.
- Whether the role suits a doctor subject to a **section 19AB restriction**.
- Sessions, start date, closing date, position type (Locum, Part-time, Full-time or Contract).

If I have not checked the Locator, walk me through it: open health.gov.au's Health Workforce Locator, enter the full street address, read off DPA and MMM, write down today's date, and confirm the map pin is actually on the practice.

## What it must produce

1. **The markdown file** matching `templates/job.md` exactly: title, slug (identical to the file name), type, specialty, state, region, suburb, postcode, mmm, dpa, classification_checked, vr_required, img_eligible, sessions, start, posted, closes, status: open, description under 160 characters, draft: true. Then the body under the headings About the role, About the practice, What the practice is looking for.
2. **No pay, no billing percentages, no promises** about registration, provider numbers or timeframes. Sponsorship, if mentioned at all, is "handled by a registered migration agent".
3. **A LinkedIn caption for the company page** that leads with what makes the role concrete: the location, the classification, and who it suits under 19AB. That specificity is the whole differentiator, so use it. End with the link to the advert.
4. **A personal repost caption for me**, following drsrego-repost-caption. Usually the compliance angle: why this location works for a restricted doctor, or what practices get wrong about the catchment.
5. **An image brief** for the LinkedIn post. Never a photo pretending to be the actual practice.
6. A reminder of what I do when it is filled: change `status: open` to `status: filled`, which keeps the page online with a banner and drops it out of the list, the sitemap and Google Jobs.

## Things it must never do

- Never invent a practice, a location or a role.
- Never state or imply a classification that I have not confirmed from the Locator, with a date.
- Never copy a job description from another board.

---

# Images, for both skills

The website and LinkedIn both need pictures, and they must be free for commercial use. Two sources, both free, no attribution legally required:

- **Unsplash** (unsplash.com), which is where every photo on the site came from already.
- **Pexels** (pexels.com) as a second option.

Each skill's image brief should give me: what the picture should show, a search term to type into Unsplash, and the alt text to use. Keep the alt text descriptive and specific, because it is read aloud to people using screen readers and it helps search.

Rules for pictures on this site:

- Never use a photo that implies it is a specific practice, doctor or patient when it is not.
- No stock photos of people in American scrubs, no stethoscope-on-keyboard clichés, no fake "team high-five" shots.
- Prefer real consulting rooms, real desks, real Australian landscape for anything about location and catchments.
- Faces are fine. Identifiable patients are not.

`CONTENT.md` in the repository explains how I add a picture to the website, including the command that makes the three sizes the site needs.

---

# How to build these

Use the skill-creator skill. For each of the two, write the SKILL.md with a name, a description that makes it trigger on the phrases above, and the full instructions including the hard content rules verbatim. Where a rule already lives in an existing skill, reference that skill by name rather than copying its contents.

When both are written, show me: the trigger phrases, one worked example of each skill's output using a real topic from this week's intel, and anything you were not sure about.
