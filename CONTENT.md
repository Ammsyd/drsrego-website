# CONTENT.md: how to add and change content yourself

Assume you have forgotten everything. Each task below stands on its own.

## How content works, in one paragraph

Every job advert and every Insights post is one text file. The file starts with a block between two `---` lines that holds the settings (title, dates, status and so on). Everything after the second `---` is the article itself, written in Markdown: `## Heading` for a heading, `- item` for a bullet, blank lines between paragraphs. When the file is pushed to the `main` branch on GitHub, Netlify builds the site and the page appears. A file with `draft: true` never appears, whatever else it says.

Three folders matter:

| Folder | What goes in it | Becomes |
|---|---|---|
| `src/jobs/` | one file per job advert | `drsrego.com.au/jobs/<file-name>/` |
| `src/insights/` | one file per post or case study | `drsrego.com.au/insights/<file-name>/` |
| `templates/` | the three starting-point files to copy from | nothing (these are never published) |

## The two ways to make a change

**A. On the GitHub website (no software needed).** Good for one file at a time. Every task below shows this route first.

**B. On your computer.** Faster once you have done it twice. Needs the website folder on your machine and Node.js installed (DEPLOY.md, last section). The commands are at the end of this document under "Doing it on your computer".

Whichever route you use, the rule is the same: **never edit `main` directly. Make the change on a new branch, open a pull request, check the deploy preview, then merge.** The GitHub website does the branch part for you when you tick "Create a new branch for this commit".

---

## Adding a job advert

**Before you open any file, check the location on the Health Workforce Locator:**

1. Go to https://www.health.gov.au/resources/apps-and-tools/health-workforce-locator and start the locator.
2. Type the practice's **full street address**, including postcode. Not the suburb. DPA is set per GP catchment, and a catchment boundary can run down a road.
3. Write down three things: the **Modified Monash Model** category (MM 1 to MM 7), whether it says **DPA** (yes or no), and **today's date**.
4. If the map pin is not on the practice, fix the address before trusting the result.

**Then create the advert:**

1. On GitHub, open the folder `templates` and click `job.md`. Click the **copy** icon (two squares) at the top right of the file to copy its contents.
2. Go to the folder `src/jobs`. Click **Add file**, then **Create new file**.
3. Name the file using lowercase letters, numbers and hyphens only, ending in `.md`. This becomes the web address. Example: `dubbo-gp-2026-10.md`.
4. Paste the template. Fill in every line that says `REPLACE`. The lines that matter most:
   - `slug:` must be exactly the file name without `.md` (so `dubbo-gp-2026-10`).
   - `mmm:` the number from the Locator, 1 to 7, no quotes.
   - `dpa:` `true` or `false`, no quotes.
   - `classification_checked:` today's date as `2026-10-03` (year-month-day).
   - `img_eligible:` `true` if a doctor with a section 19AB restriction can take the role, otherwise `false`.
   - `vr_required:` `true` or `false`.
   - `status:` `open`.
   - `closes:` the last day for applications, same date format.
   - `description:` one sentence under 160 characters, no em dashes.
   - `draft:` change to `false` when you are ready to publish.
5. Write the advert under the headings. No pay rates, no billing percentages, no promises about registration or provider numbers, no visa advice.
6. Delete the lines that start with `#` (they are notes to you).
7. Scroll down, choose **Create a new branch for this commit and start a pull request**, click **Propose changes**, then **Create pull request**.
8. Wait for the netlify comment with the **Deploy Preview** link. Open it, go to `/jobs/`, and read your advert on your phone.
9. If the build failed, click **Details** and read the lines starting with ✗. Fix them by editing the file on the same branch (GitHub, Files changed, pencil icon).
10. Click **Merge pull request**, then **Confirm merge**. Live within a minute.

## Marking a job as filled or closed

1. On GitHub, open `src/jobs/` and click the advert's file. Click the pencil icon to edit.
2. Change the line `status: open` to `status: filled` (the position is taken) or `status: closed` (applications ended without a hire).
3. Commit to a new branch, open the pull request, merge.

What happens: the page stays online with a banner saying the position has been filled or closed, it disappears from the jobs list and the sitemap, and its job structured data is removed so Google stops showing it as available. Do not delete the file; the address keeps working for anyone who saved it.

To reopen a role later, set `status: open` and update `posted`, `closes` and `classification_checked` after re-checking the Locator.

If you forget: once the `closes` date has passed, the next build shows the role as closed automatically and the checker prints a warning naming the file. Nothing rebuilds until something is pushed, though, so it is still your job to change `status` when a role is filled.

## Adding a blog post (Insights)

1. On GitHub, open `templates/post.md`, copy its contents.
2. Go to `src/insights/`, **Add file**, **Create new file**. Name it in lowercase with hyphens, ending in `.md`. The name is the web address, so make it the question or the topic: `how-long-does-a-pesci-take-to-arrange.md`.
3. Paste the template and fill in:
   - `title:` a plain question or statement.
   - `description:` one or two sentences under 160 characters.
   - `date:` today, as `2026-10-03`.
   - `last_verified:` today.
   - `category:` `doctors` or `practices`.
   - `sources:` one entry per regulator page you relied on. The link must be on health.gov.au, ahpra.gov.au or medicalboard.gov.au. Open each page and set `verified:` to today.
   - `related:` links to the service sections on the site, for example `/doctors.html#medicare` or `/clinics.html#audit`.
   - `draft: true` while you write. Change to `false` to publish.
4. Write the post. Whenever you state something a regulator decides, add a marker straight after it, like this: `[VERIFY: check the 10-year rule on the moratorium page]`. **The site refuses to publish a post while any marker remains**, so you cannot publish an unchecked fact by accident. When you have checked it, delete the marker.
5. House rules the checker enforces: no em dashes (use a comma, colon or full stop), no dollar amounts, the department is the Department of Health, Disability and Ageing.
6. Commit to a new branch, open the pull request, read the preview, merge.

When a post is published, it appears on `/insights/`, on the doctors or practices page under "Insights", and in the sitemap. Share the address on LinkedIn; the preview card uses the post title, description and the site's share image.

## Adding a case study

Same as a blog post, but copy `templates/case-study.md` instead. The differences:

- `type: case-study` is already set in the template; leave it. The post shows a "Case study" label and appears in the same lists.
- Anonymise everything. No doctor names, no practice names, no towns small enough to identify anyone. Get written permission first.
- Describe outcomes plainly: "registration was granted", "the doctor started on the agreed date". Never "we got them registered", never how long the regulator took, never an implication that anyone else would get the same result.

## Updating a "last verified" date

There are two kinds.

**A post's own date.** Open the post file, re-read every regulatory statement against its source, then change `last_verified:` to today and update the `verified:` date on each entry under `sources:`. The new date shows at the top of the post and in the sitemap.

**The site-wide sources.** The eligibility block on every job page, the FAQ answers on the practices page and the recruitment section all cite the same regulator pages. Their links and dates live in one file: `src/_data/regulatory.json`. Open it, find the entry (for example `"dpa"`), open its `url` to confirm the page is still there and says what the site says, then change its `"verified"` date to today. One edit updates every page that cites it.

Set a reminder: the Department updates DPA each year (recently in March) and MMM after each Census. Re-check `dpa`, `mmm` and `locator` after each annual update, and re-check every open job's `classification_checked` at the same time.

## Changing words on an existing page

The main pages are the `.html` files in `src/` (`index.html` is the home page, `doctors.html`, `clinics.html`, `about.html`, `contact.html`). Every section is labelled with a comment like `<!-- ================= FAQ ================= -->`. Change the words between the tags; leave the tags, and anything that says `class=` or `id=`, alone. Same branch-and-preview routine.

The header, footer and navigation live once, in `src/_includes/partials/header.njk` and `footer.njk`. Business details (phone, email, ABN) live in `src/_data/site.json`.

## Adding a photo to a page

Photos on this site come from **Unsplash** (unsplash.com) or **Pexels** (pexels.com). Both are free for commercial use and neither requires payment or credit, though we record where each photo came from in `src/assets/img/CREDITS.txt` as a courtesy and a record.

To add one:

1. Find a photo on Unsplash or Pexels. Avoid anything that implies it is a specific practice, doctor or patient when it is not. Avoid American scrubs and stethoscope-on-keyboard cliches.
2. Download the largest version and save it into `src/assets/img/src/` with a short, descriptive, lowercase name such as `waiting-room.jpg`.
3. Make the six sizes the site needs. On your computer, in the website folder:

```bash
python -c "from PIL import Image; b='waiting-room'; im=Image.open(f'src/assets/img/src/{b}.jpg').convert('RGB'); [ (lambda v,w: (v.save(f'src/assets/img/{b}-{w}.webp','WEBP',quality=78), v.save(f'src/assets/img/{b}-{w}.jpg','JPEG',quality=78,optimize=True,progressive=True)))(im.resize((w, round(im.height*w/im.width)), Image.LANCZOS), w) for w in (480,960,1600)]; print('done', im.size)"
```

4. Add a line to `src/assets/img/CREDITS.txt` with the file name and the photo's web address.
5. Copy a `<figure class="img-card">` block from any existing page, change the file name, set `height` to the number the command printed for the 960 width, and write an `alt` description of what the photo actually shows. The alt text is read aloud to people using screen readers, so describe the picture, do not stuff it with keywords.

If that feels like too much, just tell me the page and the kind of photo you want and I will do it.

## Asking me to make a change

For anything beyond adding content, the fastest route is to tell me in plain words. You do not need to know which file it lives in. Useful requests sound like:

- "On the practices page, the third service block should say supervision capacity, not supervisor capacity."
- "The home page hero photo is too dark, swap it for something brighter."
- "Add a question to the doctors FAQ about the competent authority pathway."
- "The phone number changed to 02 1234 5678."

Send a screenshot if it is easier than describing it. I make the change on a branch, you get a preview link, and it goes live when you say so. Small wording fixes take a couple of minutes.

## When something does not work

**The deploy failed.** Netlify, Deploys, click the failed one, scroll to the bottom. The checker prints one line per problem, starting with ✗, naming the file and the fix. The three most common:

| Message | Fix |
|---|---|
| `slug is "x" but the file is called "y.md"` | Make them match. Rename the file or edit the `slug:` line |
| `status must be one of open, filled, closed (found "Open")` | Lowercase, no quotes |
| `line 12 still has a [VERIFY: ...] marker` | Check the fact and delete the marker, or set `draft: true` |

Others you may see: `mmm must be a whole number from 1 to 7`, `dpa must be true or false, without quotes`, `contains an em dash`, `description is 171 characters`, `the settings block at the top is not valid YAML` (usually a missing colon, an unclosed quote, or a colon inside an unquoted title: wrap the title in double quotes).

**The page is not showing.** Check the file has `draft: false`. Check the deploy finished. Hard-refresh (Ctrl+F5).

**The advert shows but the eligibility text is wrong.** Check `dpa`, `mmm`, `img_eligible` and `vr_required` in the file. The text is generated from those four values and the `classification_checked` date.

**You broke something and want it gone now.** Netlify, Deploys, click the last good deploy, **Publish deploy**. Then fix the file at leisure. Details in DEPLOY.md.

**You cannot remember any of this.** Read the first section of this file again. Then ask for help and paste the ✗ line.

---

## Doing it on your computer

One-time setup: install Git from https://git-scm.com and Node.js LTS from https://nodejs.org. Then get the website folder (GitHub, green **Code** button, copy the address):

```bash
git clone https://github.com/Ammsyd/drsrego-website.git
```

```bash
cd drsrego-website
```

```bash
npm install
```

Every time you start work, get the latest version and start a branch named for the change:

```bash
git checkout main
```

```bash
git pull
```

```bash
git checkout -b add-dubbo-gp-advert
```

Make your change (copy a template, edit the file in any text editor). Then check it:

```bash
npm test
```

If it prints `Content OK` and `Site OK`, preview it:

```bash
npm run serve
```

Open http://localhost:8734 in your browser. Press Ctrl+C in the terminal to stop.

Save the change and send it to GitHub:

```bash
git add -A
```

```bash
git commit -m "Add Dubbo GP advert"
```

```bash
git push -u origin add-dubbo-gp-advert
```

The terminal prints a link to open a pull request. Open it, wait for the netlify preview comment, check it, merge.

Afterwards, go back to `main` so the next change starts clean:

```bash
git checkout main
```

```bash
git pull
```
