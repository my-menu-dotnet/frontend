import Link, { LinkProps } from "next/link";
import Button from "./Button";
import { ButtonProps } from "@nextui-org/react";

type NavLinkProps = LinkProps & {
  children: React.ReactNode;
  buttonProps?: ButtonProps;
};

export default function NavLink({ children, buttonProps, ...props }: NavLinkProps) {
  return (
    <Link passHref legacyBehavior {...props}>
      <Button as={"a"} className="rounded-none" {...buttonProps}>
        {children}
      </Button>
    </Link>
  );
}
