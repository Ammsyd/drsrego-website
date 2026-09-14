# DEPLOY.md: how the website gets from your computer to drsrego.com.au

Written for someone who has never used Git. Read the first section once; use the rest when you need it.

## The five words you need

- **Git** is a program that keeps a history of every change to the website files. You never lose anything, and you can always go back.
- **GitHub** is the website where that history is stored online. Your copy is at https://github.com/Ammsyd/drsrego-website. It is private.
- **A branch** is a separate copy of the site where changes are made without touching the live version. `main` is the branch that becomes the live site. Work happens on other branches, then gets merged into `main`.
- **A pull request (PR)** is GitHub's "please merge this branch into main" screen. It shows every change and gives you a preview link before anything goes live.
- **Netlify** is the hosting company. It watches the GitHub repository. Whenever `main` changes, Netlify builds the site and publishes it. Nobody uploads files by hand any more.

## What happens when something is pushed

1. A change is pushed to GitHub (from your computer, or from the GitHub website itself).
2. Netlify notices within seconds and runs the build command `npm run build`.
3. The build first runs the content checker. If any file breaks a rule (a missing field on a job, an em dash, an unresolved `[VERIFY]` marker), the build stops and nothing is published. The old site stays up.
4. If the check passes, Eleventy turns the files in `src/` into the finished website in `_site/`.
5. If the push was to `main`, Netlify publishes `_site/` to drsrego.com.au. If it was to any other branch, Netlify publishes a **deploy preview** at a temporary address instead, so you can look before it goes live.

The whole thing takes about a minute.

## Netlify settings for this site

These live in the file `netlify.toml` in the repository, so the dashboard boxes can be left blank. If you are ever asked for them:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Publish directory | `_site` |
| Node version | 22 |
| Production branch | `main` |

## First: check Netlify is connected to GitHub (two minutes, do this once)

1. Log in at https://app.netlify.com and open the drsrego site.
2. Click **Site configuration** in the left menu, then **Build & deploy**.
3. Look at **Continuous deployment**. You want to see the repository name `Ammsyd/drsrego-website`.
   - If you see it, you are connected. Check the production branch says `main` and skip to the next section.
   - If it says the site was deployed manually, or there is a **Link repository** button, click that button, choose GitHub, authorise Netlify if asked, pick `Ammsyd/drsrego-website`, set the branch to `main`, and save. Leave build command and publish directory as they are (the `netlify.toml` file sets them).
4. Click **Deploys** in the left menu and check that a new deploy starts. When it says **Published**, the site is being built from GitHub from now on.

Until this is done, pushing to GitHub changes nothing on the live site.

## How to see a preview before it goes live

1. Make your change on a branch, not on `main`. (CONTENT.md shows how; the GitHub website does this for you when you tick "Create a new branch".)
2. Open a pull request on GitHub. Within a minute or two, a comment from **netlify** appears on the pull request with a **Deploy Preview** link.
3. Open the link. That is your change, live, at a temporary address only you know. Check it on your phone as well.
4. Happy? Click **Merge pull request**, then **Confirm merge**. Netlify publishes it to drsrego.com.au within a minute.
5. Not happy? Edit the files on the same branch. Every new commit updates the same preview.

If the netlify comment says the build **failed**, click **Details**, scroll to the bottom of the log, and look for lines starting with a cross (✗). Each one names a file and says what to fix.

## Forms: what to click in Netlify

There are three forms: `enquiry` (contact page), `register-interest` (doctors) and `request-doctor` (practices). Netlify finds them automatically when it builds the site, but two things have to be switched on in the dashboard.

**Enable form detection (once):**
1. Site configuration, then **Forms** in the left menu.
2. If you see **Enable form detection**, click it. Then trigger a new deploy (Deploys, then **Trigger deploy**, then **Deploy site**) so Netlify scans the pages again.

**Get an email for every submission (once per form):**
1. Site configuration, then **Notifications** (in some accounts this is under Site configuration, then Emails and webhooks).
2. Under **Form submission notifications**, click **Add notification**, then **Email notification**.
3. Event to listen for: **New form submission**. Form: pick one of the three. Email to notify: `info@drsrego.com.au`. Save.
4. Repeat for the other two forms.

**Where submissions live:** click **Forms** in the left menu, then the form name. Every submission is listed with every field. For `register-interest`, the uploaded CV appears as a link in the submission. Netlify also has a **Spam** tab; check it occasionally, because the automatic filter is sometimes too keen.

**Limits at the time of writing:** the free Forms tier allows 100 submissions a month across all forms and limits uploads to 10 MB per file. The CV field on the site rejects files over 8 MB so that submissions stay safely under that limit. If the site gets busier than that, Netlify will email you and you can upgrade the Forms add-on. Confirm current limits at https://www.netlify.com/pricing/.

**Spam protection:** every form has a hidden honeypot field (bots fill it in, people cannot see it) and Netlify runs its own spam filter on top. If spam still gets through, Netlify can add a reCAPTCHA; ask for that change.

## How to check a form is working

1. Open the live page (or a deploy preview) in a private browser window.
2. Fill in the form with obviously fake test details, for example "TEST Faisal" and your own email.
3. Submit. You should land on the "Thank you" page.
4. In Netlify, open **Forms**, then the form name. Your test submission should be there within a few seconds.
5. Check `info@drsrego.com.au` for the notification email (look in spam the first time).
6. Delete the test submission from the Forms list so it does not sit in your records.

If step 4 fails: the form was probably not detected. Enable form detection (above) and trigger a new deploy.

## How to roll back if something breaks

**Fastest (30 seconds, no Git):**
1. Netlify, then **Deploys**.
2. Find the last deploy that was fine (they are listed newest first, with the commit message next to each).
3. Click it, then click **Publish deploy**. The site goes back to that version immediately.
4. This does not undo the change in GitHub. The next push to `main` will publish the broken version again, so fix the file before pushing anything else.

**Proper (undo the change in GitHub):**
1. On GitHub, open **Pull requests**, click **Closed**, and open the pull request that caused the problem.
2. Click **Revert**. GitHub creates a new pull request that undoes it.
3. Merge that. Netlify publishes the reverted site within a minute.

## Working on your own computer (optional)

You do not need this to add content: the GitHub website is enough (see CONTENT.md). If you want to see the site on your own machine before pushing:

Install Node.js (LTS version) from https://nodejs.org, then in the website folder run once:

```bash
npm install
```

Build the site and run every check:

```bash
npm test
```

Preview it while you edit (opens at http://localhost:8734, refreshes when you save a file):

```bash
npm run serve
```

## When something goes wrong

| What you see | What it means | What to do |
|---|---|---|
| Netlify deploy says **Failed** | The content checker found a problem, or the build broke | Open the deploy log, find the lines starting with ✗, fix those files, push again |
| Site shows an old version after a merge | Netlify has not deployed yet, or the build failed | Check Deploys. If it failed, see above. If it succeeded, hard-refresh your browser (Ctrl+F5) |
| A form submission never arrives | Form detection is off, or the notification is not set up | Follow the Forms section above, then test again |
| "Page not found" on the live site for a page you just added | The file is `draft: true`, or the build has not finished | Check the file's `draft` line, check Deploys |
| You do not know what changed | Git remembers | On GitHub, click **Commits** to see every change with its message |

If you are stuck, the fastest recovery is always the Netlify **Publish deploy** button on the last good deploy. Then ask for help with the file that broke.
