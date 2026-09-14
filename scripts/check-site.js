// check-site.js
// Runs after the build (npm run check, or as part of npm test). Reads the
// finished pages in _site/ and reports broken links, missing image
// descriptions, heading problems, duplicate titles and stray em dashes.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = path.join(root, "_site");
const problems = [];
const rel = (f) => path.relative(root, f).replace(/\\/g, "/");
const fail = (file, msg) => problems.push(`✗ ${rel(file)}: ${msg}`);

if (!fs.existsSync(site)) {
  console.error("_site/ does not exist. Run npm run build first.");
  process.exit(1);
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const htmlFiles = walk(site).filter((f) => f.endsWith(".html"));
const titles = new Map();

// Does a site-relative URL exist in _site?
function resolves(url) {
  const clean = url.split("#")[0].split("?")[0];
  if (clean === "") return true;
  let target = path.join(site, decodeURIComponent(clean));
  if (fs.existsSync(target)) {
    if (fs.statSync(target).isDirectory()) return fs.existsSync(path.join(target, "index.html"));
    return true;
  }
  // Pretty URL form (/doctors -> /doctors.html)
  if (fs.existsSync(target + ".html")) return true;
  return false;
}

// Strip scripts, styles and comments so text checks see only visible text.
const visibleText = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const urlPath = "/" + rel(file).replace(/^_site\//, "").replace(/index\.html$/, "");

  // Links and assets
  const attrs = [...html.matchAll(/\s(?:href|src)="([^"]*)"/g)].map((m) => m[1]);
  const srcsets = [...html.matchAll(/\ssrcset="([^"]*)"/g)].flatMap((m) => m[1].split(",").map((s) => s.trim().split(/\s+/)[0]));
  const imgsrcsets = [...html.matchAll(/\simagesrcset="([^"]*)"/g)].flatMap((m) => m[1].split(",").map((s) => s.trim().split(/\s+/)[0]));
  for (const u of [...attrs, ...srcsets, ...imgsrcsets]) {
    if (!u || /^(https?:|mailto:|tel:|#|data:|javascript:)/.test(u)) continue;
    const abs = u.startsWith("/") ? u : path.posix.join(path.posix.dirname(urlPath), u);
    if (!resolves(abs)) fail(file, `link or asset not found: ${u}`);
  }

  // Exactly one h1
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) fail(file, `expected exactly one <h1>, found ${h1s}.`);

  // Every image has non-empty alt
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="[^"]+"/.test(m[0])) fail(file, `an <img> has no alt text: ${m[0].slice(0, 80)}...`);
  }

  // JSON-LD parses
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch (e) {
      fail(file, `structured data does not parse: ${e.message}`);
    }
  }

  // Title present and unique
  const t = html.match(/<title>([^<]*)<\/title>/);
  if (!t) fail(file, "no <title>.");
  else {
    if (titles.has(t[1])) fail(file, `duplicate <title> "${t[1]}" (also on ${rel(titles.get(t[1]))}).`);
    else titles.set(t[1], file);
  }

  // Description
  if (!/<meta name="description" content="[^"]+"/.test(html)) fail(file, "no meta description.");

  // Canonical unless noindex
  const noindex = /<meta name="robots" content="noindex/.test(html);
  if (!noindex && !/<link rel="canonical" href="https:\/\/drsrego\.com\.au\//.test(html)) fail(file, "no canonical link.");

  // Em dashes in visible text or meta content
  const text = visibleText(html);
  if (text.includes("—") || text.includes("&mdash;")) {
    const line = text.split(/\r?\n/).findIndex((l) => l.includes("—") || l.includes("&mdash;")) + 1;
    fail(file, `contains an em dash (around output line ${line}).`);
  }
}

if (problems.length) {
  console.error("\nSite check failed.\n");
  for (const p of problems) console.error(p);
  console.error(`\n${problems.length} problem${problems.length === 1 ? "" : "s"} found across ${htmlFiles.length} pages.\n`);
  process.exit(1);
}
console.log(`Site OK: ${htmlFiles.length} pages checked, no broken links, one h1 each, all images described.`);
