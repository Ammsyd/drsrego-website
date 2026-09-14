// validate-content.js
// Runs before every build (see "build" in package.json). Reads every job and
// post file and every template, and stops the build with a plain-English
// message if something breaks a content rule. If this script prints a line
// starting with a cross, fix that file and push again.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as yaml from "js-yaml";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "src");
const problems = [];
const fail = (file, msg) => problems.push(`✗ ${path.relative(root, file).replace(/\\/g, "/")}: ${msg}`);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function readFrontMatter(file) {
  const text = fs.readFileSync(file, "utf8");
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: null, body: text, raw: text };
  try {
    return { data: yaml.load(m[1]) || {}, body: m[2], raw: text };
  } catch (e) {
    fail(file, `the settings block at the top is not valid YAML (${e.message.split("\n")[0]}). Check for a missing colon or an unclosed quote.`);
    return { data: null, body: m[2], raw: text };
  }
}

const isoDate = (v) => {
  if (v instanceof Date) return !Number.isNaN(v.getTime());
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(new Date(v).getTime());
};

function requireFields(file, data, fields) {
  for (const f of fields) {
    if (data[f] === undefined || data[f] === null || data[f] === "") {
      fail(file, `"${f}" is missing. Every file needs it (copy the line from templates/).`);
    }
  }
}

function requireEnum(file, data, field, allowed) {
  if (data[field] === undefined) return;
  if (!allowed.includes(data[field])) {
    fail(file, `${field} must be one of ${allowed.join(", ")} (found "${data[field]}"). Capital letters matter.`);
  }
}

function requireDate(file, data, field) {
  if (data[field] === undefined) return;
  if (!isoDate(data[field])) {
    fail(file, `${field} must be a date written as YYYY-MM-DD, for example 2026-09-14 (found "${data[field]}").`);
  }
}

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------
const JOB_TYPES = ["Locum", "Part-time", "Full-time", "Contract"];
const STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];
const STATUSES = ["open", "filled", "closed"];

let jobCount = 0;
let openCount = 0;
const jobsDir = path.join(src, "jobs");
if (fs.existsSync(jobsDir)) {
  for (const file of walk(jobsDir).filter((f) => f.endsWith(".md"))) {
    const { data } = readFrontMatter(file);
    if (!data) continue;
    jobCount += 1;
    requireFields(file, data, [
      "title", "slug", "type", "specialty", "state", "region", "suburb", "mmm", "dpa",
      "classification_checked", "vr_required", "img_eligible", "sessions", "start",
      "posted", "closes", "status", "description",
    ]);
    requireEnum(file, data, "type", JOB_TYPES);
    requireEnum(file, data, "state", STATES);
    requireEnum(file, data, "status", STATUSES);
    if (data.mmm !== undefined && !(Number.isInteger(data.mmm) && data.mmm >= 1 && data.mmm <= 7)) {
      fail(file, `mmm must be a whole number from 1 to 7 (found "${data.mmm}"). Check the Health Workforce Locator.`);
    }
    for (const f of ["dpa", "vr_required", "img_eligible"]) {
      if (data[f] !== undefined && typeof data[f] !== "boolean") {
        fail(file, `${f} must be true or false, without quotes (found "${data[f]}").`);
      }
    }
    for (const f of ["classification_checked", "posted", "closes"]) requireDate(file, data, f);
    const base = path.basename(file, ".md");
    if (data.slug && data.slug !== base) {
      fail(file, `slug is "${data.slug}" but the file is called "${base}.md". They must match. Rename one of them.`);
    }
    if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
      fail(file, `slug may only contain lowercase letters, numbers and hyphens (found "${data.slug}").`);
    }
    if (typeof data.description === "string" && data.description.length > 160) {
      fail(file, `description is ${data.description.length} characters; keep it under 160 so Google shows it in full.`);
    }
    if (data.status === "open" && !data.draft) openCount += 1;
  }
}

// ---------------------------------------------------------------------------
// Insights posts and case studies
// ---------------------------------------------------------------------------
let postCount = 0;
let publishedCount = 0;
const postsDir = path.join(src, "insights");
if (fs.existsSync(postsDir)) {
  for (const file of walk(postsDir).filter((f) => f.endsWith(".md"))) {
    const { data } = readFrontMatter(file);
    if (!data) continue;
    postCount += 1;
    requireFields(file, data, ["title", "description", "date", "last_verified", "category"]);
    requireEnum(file, data, "category", ["doctors", "practices"]);
    requireEnum(file, data, "type", ["article", "case-study"]);
    requireDate(file, data, "date");
    requireDate(file, data, "last_verified");
    if (typeof data.description === "string" && data.description.length > 160) {
      fail(file, `description is ${data.description.length} characters; keep it under 160 so Google shows it in full.`);
    }
    if (Array.isArray(data.sources)) {
      data.sources.forEach((s, i) => {
        if (!s || !s.label || !s.url || !s.verified) {
          fail(file, `sources item ${i + 1} needs label, url and verified (a YYYY-MM-DD date).`);
        } else if (!/^https:\/\/([a-z0-9-]+\.)*(health\.gov\.au|ahpra\.gov\.au|medicalboard\.gov\.au)\//.test(s.url) && !s.url.startsWith("[VERIFY")) {
          fail(file, `sources item ${i + 1} must point at health.gov.au, ahpra.gov.au or medicalboard.gov.au (found ${s.url}).`);
        }
      });
    }
    if (!data.draft) publishedCount += 1;
  }
}

// ---------------------------------------------------------------------------
// Site-wide text rules (every source file that ends up on the site)
// ---------------------------------------------------------------------------
const textFiles = walk(src).filter((f) => /\.(md|html|njk|json|txt)$/.test(f) && !f.includes(`${path.sep}assets${path.sep}`));
for (const file of textFiles) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);
  const isMarkdown = file.endsWith(".md");
  const { data } = isMarkdown ? readFrontMatter(file) : { data: null };
  const isDraft = Boolean(data && data.draft);

  lines.forEach((line, i) => {
    const n = i + 1;
    if (line.includes("—") || line.includes("&mdash;")) {
      fail(file, `line ${n} contains an em dash. Replace it with a comma, colon or full stop.`);
    }
    if (/Health and Aged Care/.test(line)) {
      fail(file, `line ${n} says "Health and Aged Care". The department is the Department of Health, Disability and Ageing.`);
    }
    if (isMarkdown && /\$\s?\d/.test(line)) {
      fail(file, `line ${n} contains a dollar amount. No pricing or rates may appear on the site.`);
    }
    if (line.includes("[VERIFY") && !isDraft) {
      fail(file, `line ${n} still has a [VERIFY: ...] marker. Check the fact, remove the marker, then publish.${isMarkdown ? " (Or set draft: true to keep it unpublished.)" : ""}`);
    }
  });
}

// regulatory.json must be fully resolved before anything can publish
const regFile = path.join(src, "_data", "regulatory.json");
if (fs.existsSync(regFile)) {
  try {
    const reg = JSON.parse(fs.readFileSync(regFile, "utf8"));
    for (const [key, entry] of Object.entries(reg)) {
      if (key.startsWith("_")) continue; // notes, not sources
      for (const f of ["label", "url", "verified"]) {
        if (!entry[f]) fail(regFile, `"${key}" is missing "${f}".`);
      }
      if (entry.verified && !isoDate(entry.verified)) fail(regFile, `"${key}".verified must be YYYY-MM-DD.`);
    }
  } catch (e) {
    fail(regFile, `not valid JSON (${e.message}).`);
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
if (problems.length) {
  console.error("\nContent check failed. Fix the lines below and try again.\n");
  for (const p of problems) console.error(p);
  console.error(`\n${problems.length} problem${problems.length === 1 ? "" : "s"} found.\n`);
  process.exit(1);
}
console.log(`Content OK: ${jobCount} job${jobCount === 1 ? "" : "s"} (${openCount} open), ${postCount} post${postCount === 1 ? "" : "s"} (${publishedCount} published).`);
