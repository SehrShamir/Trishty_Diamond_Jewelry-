const excludedPaths = ["/checkout", "/account/*", "/api/*"]

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://trishty.com",
  generateRobotsTxt: true,
  exclude: [...excludedPaths, "/blog/rss.xml"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: excludedPaths,
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_BASE_URL || "https://trishty.com"}/sitemap.xml`,
    ],
  },
}
