# Drs Rego website

The public website for Drs Rego, an Australian medical registration, compliance and GP recruitment consultancy. Live at https://drsrego.com.au, hosted on Netlify, built with Eleventy from the files in `src/`.

## Start here

| I want to… | Read |
|---|---|
| Add a job advert, a blog post or a case study, or mark a job as filled | [CONTENT.md](CONTENT.md) |
| Understand how the site gets published, see a preview, check forms, roll back | [DEPLOY.md](DEPLOY.md) |
| Know the brand, the content rules and the decisions behind the build | [CLAUDE.md](CLAUDE.md) |
| See what the SEO audit found and what to do about it | [SEO-AUDIT.md](SEO-AUDIT.md) |

## How it fits together

```
src/                    everything the site is built from
  _data/site.json       business details (phone, email, ABN, socials)
  _data/regulatory.json regulator source links and last-verified dates
  _includes/            the shared layout, header, footer and blocks
  *.html                the main pages (home, doctors, clinics, about, contact, legal)
  jobs/*.md             one file per job advert
  insights/*.md         one file per Insights post or case study
  assets/               CSS, JavaScript, images
  static/               robots.txt, redirects, security headers, icons
templates/              copy-and-fill starting points for a job, a post, a case study
scripts/                the content checker (before build) and the site checker (after build)
_site/                  the finished website (generated, not edited, not in Git)
netlify.toml            tells Netlify how to build: npm run build, publish _site
```

## Commands

Install once:

```bash
npm install
```

Build the site and run every check:

```bash
npm test
```

Preview at http://localhost:8734 while editing:

```bash
npm run serve
```

## Business details in the code

Email `info@drsrego.com.au`, phone `(02) 8281 6694`, Sydney NSW, FFAM Holdings Pty Ltd trading as Drs Rego, ABN 66 690 668 529, LinkedIn and Facebook links: all in `src/_data/site.json`. Change them there and every page updates.

The Calendly booking widget is on `src/contact.html`, in the block marked `Calendly inline widget begin`.

## Adding or replacing a photo

Images ship in three widths (480 / 960 / 1600 px) in WebP and JPEG. Save the original into `src/assets/img/src/`, then generate the six variants with Python and Pillow:

```bash
pip install Pillow
```

```bash
python -c "from PIL import Image; im=Image.open('src/assets/img/src/my-photo.jpg').convert('RGB'); [ (lambda v,w: (v.save(f'src/assets/img/my-photo-{w}.webp','WEBP',quality=78), v.save(f'src/assets/img/my-photo-{w}.jpg','JPEG',quality=78,optimize=True,progressive=True)))(im.resize((w, round(im.height*w/im.width)), Image.LANCZOS), w) for w in (480,960,1600)]"
```

Copy an existing `<picture>` block from a page, change the file names, set `width` and `height` to the real size of the 960 variant, write a meaningful `alt`, and add the source to `src/assets/img/CREDITS.txt`.

## Deliberately not on this site

- No pricing. Every service ends in an enquiry.
- No immigration or visa content. Visa matters are referred to a registered migration agent.
- No outcome guarantees or regulator turnaround times.
- No regulatory statement without a source link and a last-verified date.

Historical reports from the July 2026 launch are in `docs/archive/`.
