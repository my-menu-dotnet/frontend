import { createFileRoute } from "@tanstack/react-router";

const ROBOTS_TXT = `User-agent: *
Allow: /
Disallow: /dashboard/

Sitemap: https://my-menu.net/sitemap.xml
`;

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(ROBOTS_TXT, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
