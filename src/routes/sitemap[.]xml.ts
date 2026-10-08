import { createFileRoute } from "@tanstack/react-router";

const BASE = "https://my-menu.net";

const buildSitemap = (): string => {
  const lastmod = new Date().toISOString();
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <url><loc>${BASE}</loc><lastmod>${lastmod}</lastmod><changefreq>yearly</changefreq><priority>1.0</priority></url>`,
    `  <url><loc>${BASE}/#about</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`,
    "</urlset>",
  ].join("\n");
};

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(buildSitemap(), {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
