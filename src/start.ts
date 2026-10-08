import { createStart, createMiddleware } from "@tanstack/react-start";

/**
 * Redirect requests from the legacy `lettes.my-menu.net` hostname to the
 * canonical `my-menu.net` domain.
 *
 * Special case: the `/` and `/menu` landing pages are sent to the demo
 * menu UUID so the original quick-access flow still works.
 */
const hostnameRedirect = createMiddleware().server(async ({ next, request }) => {
  const url = new URL(request.url);

  if (url.hostname === "lettes.my-menu.net") {
    if (url.pathname === "/" || url.pathname === "/menu") {
      return Response.redirect(
        "https://lettes.my-menu.net/menu/34966345-2ec8-4227-b9c6-08a34d2d25a6",
        307
      );
    }

    url.hostname = "my-menu.net";
    return Response.redirect(url.toString(), 307);
  }

  return next();
});

export const startInstance = createStart(() => ({
  requestMiddleware: [hostnameRedirect],
}));
