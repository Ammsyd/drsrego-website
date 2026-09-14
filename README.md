# Drs Rego — website

A complete static website. No frameworks, no build step — plain HTML, one CSS
file, one small JavaScript file. Edit any page by opening it in a text editor
(Notepad works); every section is labelled with an HTML comment like
`<!-- ================= HERO ================= -->`.

```
/
├── index.html          Home
├── doctors.html        For doctors (services + FAQ)
├── clinics.html        For clinics
├── about.html          About / boundaries
├── contact.html        Enquiry form + booking block
├── privacy.html        Privacy Policy (template — lawyer review before launch)
├── terms.html          Terms of Use (template — lawyer review before launch)
├── 404.html            "Page not found" page (see §4 for hosting setup)
├── sitemap.xml         For search engines
├── robots.txt          For search engines (AI crawlers deliberately allowed)
├── llms.txt            Site summary for AI search engines (ChatGPT, Perplexity…)
├── favicon.svg         Browser tab icon
├── apple-touch-icon.png  Home-screen icon (iOS)
├── SEO_AUDIT_REPORT.md Audit + fixes record (not linked from the site)
└── assets/
    ├── css/styles.css  All styling (design tokens at the top)
    ├── js/main.js      Menu, scroll reveal, form validation
    └── img/            Processed images + CREDITS.txt (+ src/ originals)
```

---

## 1. Business details — all filled in

There are **no placeholders left to replace**. The following are live in the code:

| Detail | Value | Where |
|---|---|---|
| Email | info@drsrego.com.au | Every footer, contact form fallback, legal pages, structured data |
| Phone | (02) 8281 6694 (`tel:+61282816694`) | Every footer, structured data |
| Location | Sydney, NSW | Every footer, structured data, `terms.html` governing law (New South Wales) |
| Legal entity | FFAM Holdings Pty Ltd trading as Drs Rego · ABN 66 690 668 529 | Every footer bottom bar, structured data |
| LinkedIn | https://www.linkedin.com/company/drsrego/ | Footer icons + `sameAs` |
| Facebook | https://www.facebook.com/profile.php?id=61591452797628 | Footer icons + `sameAs` |
| Instagram | none (removed by request) | — |
| Calendly | https://calendly.com/drsrego-info/30min (brand-coloured) | `contact.html`, live embed |
| Legal "Last updated" | 7 July 2026 | `privacy.html`, `terms.html` — update when your lawyer revises them |

## 2. The enquiry form (Netlify Forms)

The form in `contact.html` is wired for **Netlify Forms** (`data-netlify="true"`,
spam honeypot included, success redirect to `/thank-you.html`). After the first deploy:

1. Netlify dashboard → your site → **Forms** → enable form detection (if asked).
2. **Forms → Form notifications → Add notification → Email** and enter
   `info@drsrego.com.au` — submissions then arrive by email as well as in the
   dashboard. Free tier: 100 submissions/month.

> **Important:** Netlify Forms only work while the site is hosted on Netlify.
> If you ever move to cPanel or another host, the form will stop capturing
> submissions (visitors would see the thank-you page but nothing is recorded) —
> reconnect it to a form service such as Formspree at that point.

## 3. The Calendly booking widget

Already active on `contact.html` (30-minute call, brand colours). To change the
event type or colours later, edit the `data-url` inside the block marked
`<!-- Calendly inline widget begin -->`. Manage availability at calendly.com.

## 4. Deploy (Netlify)

1. Go to <https://app.netlify.com/drop> (or create a site in the dashboard).
2. Drag this whole folder onto the page.
3. **Domain settings** → add `drsrego.com.au` and follow the DNS instructions;
   enable HTTPS (automatic) and set the primary domain so `www` redirects to
   the non-www address (the canonical used across the site).
4. Do the Forms steps in §2 above.

Netlify serves `404.html` automatically — no configuration needed.

If your final domain is ever not `https://drsrego.com.au/`, update that address
in: each page's `<link rel="canonical">` and Open Graph tags, `sitemap.xml`,
`robots.txt`, `llms.txt`, and the structured-data blocks in each page's `<head>`.

(Fallback — cPanel hosting: upload everything to `public_html`, add
`ErrorDocument 404 /404.html` to `.htaccess`, and reconnect the form per §2's
warning.)

**Security headers (hosting-level recommendation)** — these cannot be set from
the HTML files; add them at the host when convenient:
- cPanel: in `.htaccess` —
  `Header set X-Content-Type-Options "nosniff"` and a Content-Security-Policy
  suited to the site (it only loads from itself + Google Fonts + Calendly).
- Netlify: the same headers via a `_headers` file.
They are a hardening nicety, not a launch blocker.

**After launch (search engines)**:
1. Google Search Console: verify the domain, submit `sitemap.xml`.
2. Bing Webmaster Tools: same (Bing also feeds ChatGPT Search).
3. Check social previews render: paste each page URL into a social debugger
   (LinkedIn Post Inspector, Facebook Sharing Debugger) once live.

## 5. Editing copy safely

- Every section of every page is labelled:
  `<!-- ================= SERVICES STRIP ================= -->` etc.
  Edit the text between the tags; avoid deleting the tags themselves.
- Text lives between `>` and `<`. For example, in
  `<h2>Six things, done properly.</h2>` you can change everything between
  `<h2>` and `</h2>`.
- Don't remove attributes like `class="..."` or `id="..."` — the styling and
  footer links depend on them.
- After editing, open the file in your browser to check it before uploading.

## 6. Adding or replacing a photo

Images ship in three widths (480 / 960 / 1600 px) in two formats (WebP + JPEG),
generated at quality 78. To add a new photo:

1. Save the original into `assets/img/src/` (e.g. `my-photo.jpg`).
2. Create the six variants. If you have Python installed:

   ```
   pip install Pillow
   python - <<"PY"
   from PIL import Image
   im = Image.open("assets/img/src/my-photo.jpg").convert("RGB")
   for w in (480, 960, 1600):
       h = round(im.height * w / im.width)
       v = im.resize((w, h), Image.LANCZOS)
       v.save(f"assets/img/my-photo-{w}.webp", "WEBP", quality=78)
       v.save(f"assets/img/my-photo-{w}.jpg", "JPEG", quality=78, optimize=True, progressive=True)
   PY
   ```

   (Or use any online converter to produce the same six files.)
3. Copy an existing `<picture>` block from a page, change the file names, set
   the `width`/`height` attributes to the real pixel size of the 960 variant,
   and write a meaningful `alt` description.
4. Add the photo's source line to `assets/img/CREDITS.txt`.

## 7. What's deliberately NOT on this site

- **No pricing** — every service ends in an enquiry, by design.
- **No immigration/visa content** — the scope note appears on the homepage,
  Doctors page, About page and every footer. Keep it there.
