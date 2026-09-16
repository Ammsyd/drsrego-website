// Settings applied to every file in src/jobs/ (except index.njk, which overrides them).
import MarkdownIt from "markdown-it";

const md = new MarkdownIt({ html: true });
const stripFrontMatter = (raw) => String(raw || "").replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");

export default {
  layout: "layouts/job.njk",
  tags: ["jobs"],
  navSection: "jobs",
  specialty: "General Practice",
  schemaType: "job",
  eleventyComputed: {
    // A file that sets its own permalink (the listing page) keeps it.
    permalink: (data) => data.permalink || `/jobs/${data.slug || data.page.fileSlug}/`,
    breadcrumb: (data) =>
      data.status ? { parent: { name: "Jobs", url: "/jobs/" }, name: data.title } : data.breadcrumb,
    // An open role whose closing date has passed is treated as closed at build
    // time, so a stale advert cannot keep JobPosting data or a listing entry.
    status: (data) => {
      if (data.status === "open" && data.closes) {
        const c = new Date(data.closes);
        const endOfDay = new Date(Date.UTC(c.getUTCFullYear(), c.getUTCMonth(), c.getUTCDate(), 23, 59, 59));
        if (endOfDay < new Date()) return "closed";
      }
      return data.status;
    },
    // Filled and closed roles stay online but are not offered to search engines.
    noindex: (data) => (data.status ? data.status !== "open" : data.noindex),
    // The advert body as HTML, used for the JobPosting structured data.
    jobDescriptionHtml: (data) => (data.status ? md.render(stripFrontMatter(data.page.rawInput)) : ""),
  },
};
