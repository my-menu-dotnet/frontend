import { Link } from "@tanstack/react-router";
import Button, { type ButtonProps } from "./Button";
import type { ReactNode } from "react";

type NavLinkProps = {
  to: string;
  params?: Record<string, string>;
  search?: Record<string, unknown>;
  hash?: string;
  target?: string;
  type?: string;
  className?: string;
  children: ReactNode;
  buttonProps?: ButtonProps;
};

/**
 * Wrapper around TanStack Router's type-safe <Link> + the local <Button>.
 *
 * Use `to` for internal app routes (e.g. "/auth") and pass `params`/`search`
 * for dynamic segments. For external URLs or `mailto:`/`tel:` links, use
 * a plain `<a>` instead — TanStack Router's <Link> is for app routes.
 */
export default function NavLink({
  to,
  params,
  search,
  hash,
  target,
  className,
  children,
  buttonProps,
}: NavLinkProps) {
  const isExternal =
    /^https?:\/\//.test(to) ||
    to.startsWith("mailto:") ||
    to.startsWith("tel:");

  if (isExternal) {
    return (
      <Button className="rounded-none" {...buttonProps}>
        <a href={to} target={target} className={className}>
          {children}
        </a>
      </Button>
    );
  }

  return (
    <Button className="rounded-none" {...buttonProps}>
      <Link
        to={to}
        params={params as never}
        search={search as never}
        hash={hash}
        target={target}
        className={className}
      >
        {children}
      </Link>
    </Button>
  );
}
