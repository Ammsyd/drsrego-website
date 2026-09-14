# Drs Rego — Contact Form Fix Report

Fixed: 7 July 2026 · Scope: broken Netlify Forms submission, missing thank-you page, missing custom 404

## The three production failures and their causes

1. **POST /thanks.html → 404**: the form's success page was named `thanks.html` and the action was the relative path `thanks.html`; the page was missing from the deployed build, and the required name going forward is `/thank-you.html` (root-absolute).
2. **No submissions captured**: the deployed form was not being detected by Netlify. The form now carries the full, verified attribute set Netlify's build-time parser needs (`name`, `method="POST"`, `data-netlify="true"`, hidden `form-name` input matching the form name, honeypot).
3. **Default 404 instead of custom**: `404.html` must exist at the deploy root with exactly that lowercase name. It exists in this build and has been re-verified; whatever was deployed previously did not include it.

## (a) Files changed and why

| File | Change | Why |
|---|---|---|
| `thank-you.html` | **Created** at project root, full site design (same head includes, header/nav, footer as other pages). Content: `<h1>Thank you</h1>`, "Your enquiry has been received. We reply within two business days.", link back to the homepage. `<meta name="robots" content="noindex">`. | Form success target; must exist at `/thank-you.html` |
| `thanks.html` | **Deleted** | Superseded by `thank-you.html`; leaving both invites future confusion |
| `contact.html` | Form opening tag rebuilt to the exact required shape (styling hooks `id="enquiry-form"` and `class="form-grid"` retained, `novalidate` retained for custom validation UI). Honeypot changed to the prescribed `<p style="display:none">` markup. Removed the obsolete `data-fallback-email` attribute and the unused `form-status` element. Setup comment updated. | Netlify detection + correct success redirect |
| `assets/js/main.js` | Removed the `mailto:` fallback branch entirely and its two dead variables. The submit handler now calls `preventDefault()` **only when validation fails**; a valid form submits natively. File header comment updated. | The fallback could divert a native POST; Netlify now owns submission |
| `404.html` | Already existed at root with the correct lowercase name and site design (created in the earlier SEO pass); links given the site's standard link styling. | Netlify serves root `404.html` automatically — no redirect config added, per requirements |
| `README.md` | Two references to `thanks.html` updated to `/thank-you.html` | Consistency sweep |
| `SEO_AUDIT_REPORT.md` | Addendum reference updated to `/thank-you.html` with a note recording the rename | Consistency sweep (historical mention kept, clearly marked) |

Not changed: form visual design, field order and copy are untouched; every field already had a `name` attribute (`name`, `email`, `phone`, `role`, `message`, `consent`) so none were added. Decision noted: the select keeps its existing `name="role"` rather than being renamed to `enquirer_type` — the brief asked for sensible names *where missing*, and renaming a working field would only relabel the Netlify dashboard column. `sitemap.xml` was confirmed to exclude `thank-you.html` and `404.html` (no change needed), and neither page is linked from the nav or footer.

## (b) Final form opening tag as shipped

```html
<form id="enquiry-form" class="form-grid" name="enquiry" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thank-you.html" novalidate>
  <input type="hidden" name="form-name" value="enquiry">
  <p style="display:none"><label>Don&rsquo;t fill this out: <input name="bot-field"></label></p>
```

## (c) Local verification results

Served locally with `python -m http.server` and driven in a real browser:

| Check | Result |
|---|---|
| Rendered DOM: `data-netlify="true"`, `netlify-honeypot="bot-field"`, `action="/thank-you.html"`, `name="enquiry"` | **PASS** (read from the live DOM, not source) |
| Hidden `form-name` input value equals the form's name (`enquiry`) | **PASS** |
| Honeypot present in DOM but not visible (`offsetParent === null`) | **PASS** |
| Every visible input/select/textarea has a `name` (6/6: name, email, phone, role, message, consent) | **PASS** |
| JavaScript errors on contact.html | **None** (console clean) |
| Valid submission attempts a native POST to the right URL | **PASS** — browser issued `POST http://localhost:8734/thank-you.html`; the static server answered `501 Unsupported method ('POST')`, which is the expected local result (Netlify intercepts this POST in production) |
| Invalid submission blocked client-side | **PASS** — `preventDefault()` fires only in the failed-validation branch (the only other two calls are the mobile-menu keyboard focus trap, unrelated to submission) |
| No `mailto:` anywhere in main.js | **PASS** |
| `/thank-you.html` and `/404.html` load and match the site design | **PASS** — screenshots taken; branded header, typography and footer render correctly |
| HTML validity (balanced tags, unique IDs, one `h1`) on all modified pages | **PASS** (machine-parsed) |
| No `thanks.html` references remain in any site file | **PASS** (one clearly-marked historical mention in SEO_AUDIT_REPORT.md) |
| `sitemap.xml` excludes thank-you and 404 pages; neither is in nav/footer | **PASS** |

## (d) Post-deploy checklist (manual — needs the live site)

- [ ] Drag the updated folder into Netlify → Deploys (or git push)
- [ ] Netlify → **Forms** tab: confirm a form named **enquiry** is listed
- [ ] Open the enquiry form → **Settings & usage → Form notifications → Add notification → Email notification** → `info@drsrego.com.au` → Save
- [ ] Live test in an incognito window: submit the form → should land on `/thank-you.html`
- [ ] Confirm the notification email arrives at info@drsrego.com.au (check spam the first time)
- [ ] Confirm the submission appears in the Netlify Forms dashboard
- [ ] Visit a made-up URL (drsrego.com.au/nonsense) → confirm the custom 404 now shows

One deployment note: make sure the **entire current folder** is what gets deployed — the production symptoms (missing thank-you page, undetected form, default 404) are consistent with an earlier copy of the site having been uploaded. Netlify only parses forms and picks up `404.html` from the files present in the deploy.
