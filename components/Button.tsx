import * as React from "react";
import { buttonVariants, type Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const COLOR_TO_VARIANT = {
  primary: "default",
  danger: "destructive",
  error: "destructive",
  default: "outline",
  secondary: "secondary",
  success: "secondary",
  warning: "secondary",
} as const;

type ColorAlias = keyof typeof COLOR_TO_VARIANT;

const VARIANT_ALIAS_MAP: Record<string, string> = {
  bordered: "outline",
  flat: "secondary",
  faded: "outline",
  solid: "default",
  light: "ghost",
  underlined: "underline",
  shadow: "default",
  ghost: "ghost",
};

export type ButtonProps = Omit<
  React.ComponentProps<"button">,
  "color" | "value"
> & {
  /** Optional plain-text label rendered alongside `children`. */
  text?: string;
  /** Optional React node rendered as the button's content (after `text`). */
  children?: React.ReactNode;
  /** Hero-UI alias for `variant` (e.g. "primary" | "danger" | "default"). */
  color?: ColorAlias | string;
  /** Hero-UI alias for `onClick`. */
  onPress?: React.MouseEventHandler<HTMLButtonElement>;
  /** Hero-UI loading flag — shows a spinner and disables the button. */
  isLoading?: boolean;
  /** Hero-UI icon-only flag — applies square sizing. */
  isIconOnly?: boolean;
  /** Hero-UI disabled alias. */
  isDisabled?: boolean;
  /** Element rendered before the button's label. */
  startContent?: React.ReactNode;
  /** Element rendered after the button's label. */
  endContent?: React.ReactNode;
  /** Additional shadcn variant passthrough (overrides `color`). */
  variant?: string;
  /** Additional shadcn size passthrough. */
  size?: string;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    text,
    children,
    className,
    color,
    variant,
    onPress,
    isLoading,
    isIconOnly,
    isDisabled,
    startContent,
    endContent,
    type = "button",
    disabled,
    ...rest
  },
  ref,
) {
  const resolvedFromVariant = variant
    ? (VARIANT_ALIAS_MAP[variant] ?? variant)
    : undefined;
  const resolvedVariant =
    (resolvedFromVariant as React.ComponentProps<typeof ShadcnButton>["variant"]) ??
    (color && color in COLOR_TO_VARIANT
      ? COLOR_TO_VARIANT[color as ColorAlias]
      : "default");

  const resolvedDisabled = disabled || isDisabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      data-slot="button"
      data-variant={resolvedVariant}
      className={cn(
        buttonVariants({ variant: resolvedVariant, size: "lg" }),
        "font-semibold shadow-sm h-10 rounded-md px-4",
        isIconOnly && "h-8 w-8 p-0",
        className,
      )}
      onClick={onPress ?? rest.onClick}
      disabled={resolvedDisabled}
      {...rest}
    >
      {isLoading && (
        <span
          className="inline-block h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      )}
      {startContent}
      {text}
      {children}
      {endContent}
    </button>
  );
});

export default Button;
