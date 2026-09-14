// Eleventy configuration for the Drs Rego website.
// Eleventy reads everything in src/, applies the layouts in src/_includes/,
// and writes the finished site to _site/ (which Netlify publishes).

export default function (eleventyConfig) {
  // Files copied to the output exactly as they are.
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/static": "." });
  // src/static holds files to copy, not templates to render.
  eleventyConfig.ignores.add("src/static/**");

  // Any file with "draft: true" in its front matter is left out of the build.
  eleventyConfig.addPreprocessor("drafts", "*", (data) => {
    if (data.draft) return false;
  });

  // ---- Filters used in templates -------------------------------------------
  const toDate = (d) => (d instanceof Date ? d : new Date(d));

  // 2026-09-14 -> "14 September 2026"
  eleventyConfig.addFilter("dateAU", (d) =>
    toDate(d).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    })
  );

  // Date -> "2026-09-14"
  eleventyConfig.addFilter("isoDate", (d) => toDate(d).toISOString().slice(0, 10));

  // "/jobs/" -> "https://drsrego.com.au/jobs/"
  eleventyConfig.addFilter("absoluteUrl", (path, base) => new URL(path, base).href);

  // Object -> JSON safe to place inside a <script> tag.
  eleventyConfig.addFilter("jsonld", (obj) =>
    JSON.stringify(obj, null, 2).replace(/</g, "\u003c")
  );

  // First N items of an array.
  eleventyConfig.addFilter("head", (arr, n) => (arr || []).slice(0, n));

  // ---- Collections ----------------------------------------------------------
  const byPostedDesc = (a, b) => new Date(b.data.posted) - new Date(a.data.posted);
  const byDateDesc = (a, b) => new Date(b.data.date) - new Date(a.data.date);

  eleventyConfig.addCollection("jobs", (api) =>
    api.getFilteredByTag("jobs").sort(byPostedDesc)
  );
  eleventyConfig.addCollection("openJobs", (api) =>
    api
      .getFilteredByTag("jobs")
      .filter((j) => j.data.status === "open")
      .sort(byPostedDesc)
  );
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByTag("insights").sort(byDateDesc)
  );
  eleventyConfig.addCollection("postsDoctors", (api) =>
    api.getFilteredByTag("insights").filter((p) => p.data.category === "doctors").sort(byDateDesc)
  );
  eleventyConfig.addCollection("postsPractices", (api) =>
    api.getFilteredByTag("insights").filter((p) => p.data.category === "practices").sort(byDateDesc)
  );

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["html", "njk", "md", "txt"],
  };
}
