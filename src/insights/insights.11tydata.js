// Settings applied to every file in src/insights/ (except index.njk, which overrides them).
export default {
  layout: "layouts/post.njk",
  tags: ["insights"],
  navSection: "insights",
  type: "article",
  schemaType: "article",
  ogType: "article",
  eleventyComputed: {
    permalink: (data) => data.permalink || `/insights/${data.page.fileSlug}/`,
    breadcrumb: (data) =>
      data.category ? { parent: { name: "Insights", url: "/insights/" }, name: data.title } : data.breadcrumb,
  },
};
