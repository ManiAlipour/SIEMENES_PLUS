/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: "https://siemensplus1.ir",
  generateRobotsTxt: true,
  generateIndexSitemap: false,

  exclude: [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify",
    "/admin",
    "/admin/*",
    "/dashboard",
    "/dashboard/*",
    "/api/*",
  ],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/verify",
          "/admin",
          "/dashboard",
          "/api",
        ],
      },
    ],
    additionalSitemaps: [`https://siemensplus1.ir/sitemap.xml`],
  },

  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: "weekly",
      priority: path === "/" ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
    };
  },

  additionalPaths: async (config) => {
    const result = [];

    const products = await fetch(
      "https://siemensplus1.ir/api/products/sitemap",
    ).then((res) => res.json());
    return products.data.map((product) => ({
      loc: `/shop/${product.slug}`,
      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date().toISOString(),
    }));
  },
};