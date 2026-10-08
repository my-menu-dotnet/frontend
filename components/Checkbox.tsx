import * as React from "react";
import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox";

type ShadcnCheckboxProps = React.ComponentProps<typeof ShadcnCheckbox>;

export type CheckboxProps = Omit<
  ShadcnCheckboxProps,
  "checked" | "onCheckedChange" | "value"
> & {
  /** Controlled checked state (preferred). */
  checked?: boolean | "indeterminate";
  /** Controlled change handler (preferred). */
  onCheckedChange?: (checked: boolean) => void;
  /** Hero-UI alias for `checked`. */
  isSelected?: boolean;
  /** Hero-UI alias for `onCheckedChange`. */
  onValueChange?: (value: boolean) => void;
  /** Render-prop content (label, description, etc.). */
  children?: React.ReactNode;
  /** Hero-UI passthrough — checkbox can carry a value of any type. */
  value?: unknown;
  /** Hero-UI disabled alias. */
  isDisabled?: boolean;
  /** Hero-UI readonly alias. */
  isReadOnly?: boolean;
  /** Hero-UI required alias. */
  isRequired?: boolean;
  /** Native onChange passthrough. */
  onChange?: React.ChangeEventHandler<HTMLButtonElement>;
  /** Native onBlur passthrough. */
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
  /** Hero-UI form registration — name passthrough. */
  name?: string;
};

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  function Checkbox(
    {
      isSelected,
      onValueChange,
      checked: controlledChecked,
      onCheckedChange,
      isDisabled,
      isReadOnly,
      isRequired,
      children,
      ...rest
    },
    ref,
  ) {
    const checked = isSelected ?? controlledChecked;
    const handleChange = onValueChange
      ? (value: boolean | "indeterminate") => onValueChange(value === true)
      : onCheckedChange;

    const { value: _ignoredValue, ...shadcnRest } = rest as {
      value?: unknown;
    } & Record<string, unknown>;

    return (
      <label className="inline-flex items-center gap-2 text-sm leading-none cursor-pointer select-none">
        <ShadcnCheckbox
          ref={ref}
          checked={checked as boolean | "indeterminate" | undefined}
          onCheckedChange={handleChange}
          disabled={isDisabled}
          required={isRequired}
          className="mt-0.5"
          {...(shadcnRest as React.ComponentProps<typeof ShadcnCheckbox>)}
        />
        <span className="leading-none pt-0.5">{children}</span>
      </label>
    );
  },
);

export default Checkbox;
