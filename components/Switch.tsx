import * as React from "react";
import { Switch as ShadcnSwitch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type ShadcnSwitchProps = React.ComponentProps<typeof ShadcnSwitch>;

export type SwitchProps = Omit<
  ShadcnSwitchProps,
  "checked" | "onCheckedChange" | "value" | "onChange"
> & {
  /** Controlled checked state (preferred). */
  checked?: boolean;
  /** Controlled change handler (preferred). */
  onCheckedChange?: (checked: boolean) => void;
  /** Hero-UI alias for `checked`. */
  isSelected?: boolean;
  /** Hero-UI alias for `onCheckedChange`. */
  onValueChange?: (value: boolean) => void;
  /** Optional label rendered next to the switch. */
  children?: React.ReactNode;
  className?: string;
  /** Hero-UI disabled alias. */
  isDisabled?: boolean;
  /** Hero-UI readonly alias. */
  isReadOnly?: boolean;
  /** Native value passthrough (Hero-UI often passed boolean here). */
  value?: boolean;
  /** Hero-UI-style native onChange passthrough. */
  onChange?: (event: { target: { checked: boolean } }) => void;
  /** Native change handler. */
  onChangeEvent?: React.ChangeEventHandler<HTMLButtonElement>;
  /** Optional name attribute. */
  name?: string;
};

const SwitchRoot = React.forwardRef<HTMLButtonElement, SwitchProps>(
  function Switch(
    {
      isSelected,
      onValueChange,
      checked: controlledChecked,
      onCheckedChange,
      onChange,
      children,
      className,
      isDisabled,
      isReadOnly,
      ...rest
    },
    ref,
  ) {
    const checked = isSelected ?? controlledChecked;
    const handleChange = onValueChange
      ? (value: boolean) => {
          onValueChange(value);
          onChange?.({ target: { checked: value } });
        }
      : onCheckedChange;

    const { value: _ignoredValue, ...shadcnRest } = rest as {
      value?: unknown;
    } & Record<string, unknown>;

    return (
      <label className="inline-flex items-center gap-2 text-sm leading-none">
        <ShadcnSwitch
          ref={ref}
          checked={checked}
          onCheckedChange={handleChange}
          disabled={isDisabled}
          className={cn(className)}
          {...(shadcnRest as React.ComponentProps<typeof ShadcnSwitch>)}
        />
        {children}
      </label>
    );
  },
);

type StatusProps = Omit<
  SwitchProps,
  "checked" | "onCheckedChange" | "isSelected" | "onValueChange" | "value"
> & {
  value: "ACTIVE" | "INACTIVE";
  onChange: (value: "ACTIVE" | "INACTIVE") => void;
};

function Status({ value, onChange, ...rest }: StatusProps) {
  return (
    <SwitchRoot
      isSelected={value === "ACTIVE"}
      onValueChange={(v) => onChange(v ? "ACTIVE" : "INACTIVE")}
      {...rest}
    >
      {value === "ACTIVE" ? "Ativo" : "Inativo"}
    </SwitchRoot>
  );
}

type ActiveProps = Omit<
  SwitchProps,
  "checked" | "onCheckedChange" | "isSelected" | "onValueChange" | "value"
> & {
  value: boolean;
  onChange?: (value: boolean) => void;
};

function Active({ value, onChange, ...rest }: ActiveProps) {
  return (
    <SwitchRoot
      isSelected={value}
      onValueChange={(v) => onChange?.(v)}
      {...rest}
    >
      {value ? "Ativo" : "Inativo"}
    </SwitchRoot>
  );
}

const Switch = SwitchRoot as typeof SwitchRoot & {
  Status: typeof Status;
  Active: typeof Active;
};

Switch.Status = Status;
Switch.Active = Active;

export default Switch;
