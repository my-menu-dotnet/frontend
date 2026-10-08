import * as React from "react";
import {
  Select as ShadcnSelect,
  SelectTrigger as ShadcnSelectTrigger,
  SelectValue as ShadcnSelectValue,
  SelectContent as ShadcnSelectContent,
  SelectItem as ShadcnSelectItem,
  SelectGroup as ShadcnSelectGroup,
  SelectLabel as ShadcnSelectLabel,
  SelectSeparator as ShadcnSelectSeparator,
} from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

/**
 * Re-export the shadcn primitives so call sites can build a Select exactly as
 * documented for the shadcn/ui "radix-nova" preset:
 *
 *   <Select value={v} onValueChange={setV}>
 *     <SelectTrigger><SelectValue placeholder="..." /></SelectTrigger>
 *     <SelectContent>
 *       <SelectItem value="a">A</SelectItem>
 *     </SelectContent>
 *   </Select>
 */
export const Select = ShadcnSelect;
export const SelectTrigger = ShadcnSelectTrigger;
export const SelectValue = ShadcnSelectValue;
export const SelectContent = ShadcnSelectContent;
export const SelectItem = ShadcnSelectItem;
export const SelectGroup = ShadcnSelectGroup;
export const SelectLabel = ShadcnSelectLabel;
export const SelectSeparator = ShadcnSelectSeparator;

export type SelectSharedProps = Omit<
  React.ComponentProps<typeof ShadcnSelect>,
  "value" | "defaultValue" | "onValueChange"
> & {
  /** Controlled value (preferred). */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Change handler (preferred). */
  onValueChange?: (value: string) => void;
  /** Hero-UI alias for `value` — accepts an iterable of selected keys. */
  selectedKeys?: Iterable<string> | string;
  /** Hero-UI alias for `onValueChange`. */
  onSelectionChange?: (keys: Iterable<string> | string) => void;
  /** Optional visible label. */
  label?: string;
  /** Placeholder text shown when no value is selected. */
  placeholder?: string;
  /** Optional error message. */
  errorMessage?: string;
  /** Optional helper text shown below the select. */
  description?: string;
  /** Mark the field as required. */
  required?: boolean;
  /** Hero-UI required alias. */
  isRequired?: boolean;
  /** Hero-UI invalid alias (sets `aria-invalid` on the trigger). */
  isInvalid?: boolean;
  /** Hero-UI disabled alias. */
  isDisabled?: boolean;
  /** Hero-UI readonly alias. */
  isReadOnly?: boolean;
  /** Trigger className passthrough. */
  className?: string;
  /** Children — typically SelectTrigger + SelectContent. */
  children?: React.ReactNode;
  /** Native change handler passthrough (Hero-UI-style). */
  onChange?: (event: { target: { value: string } }) => void;
};

/**
 * Brand select. Accepts both the shadcn-native API (`value`/`onValueChange` +
 * `SelectTrigger`/`SelectContent` children) and the legacy Hero-UI API
 * (`selectedKeys`/`onSelectionChange` + `onChange` + `placeholder`/`label`).
 *
 * For the Hero-UI API, the wrapper derives the shadcn-style children from the
 * provided props: it injects a `SelectTrigger` + `SelectValue placeholder=...`
 * and a `SelectContent` that wraps any `SelectItem` children it finds.
 */
const SelectRoot = React.forwardRef<HTMLDivElement, SelectSharedProps>(
  function SelectRoot(props, _ref) {
    return <ShadcnSelect {...props} />;
  },
);

function normalizeSelectedKeys(
  selectedKeys: Iterable<string> | string | undefined,
): string | undefined {
  if (selectedKeys === undefined) return undefined;
  if (typeof selectedKeys === "string") return selectedKeys;
  const arr = Array.from(selectedKeys);
  return arr[0];
}

/**
 * Convenience wrapper: when call sites use the Hero-UI API (passing
 * `selectedKeys` / `onChange` and `<SelectItem>` children), this renders the
 * shadcn primitives under the hood with the correct initial value, placeholder,
 * and label.
 */
function HeroSelect(props: SelectSharedProps) {
  const {
    label,
    placeholder,
    errorMessage,
    description,
    required,
    isRequired,
    isInvalid,
    isDisabled,
    isReadOnly,
    className,
    selectedKeys,
    value: controlledValue,
    defaultValue,
    onValueChange,
    onChange,
    onSelectionChange,
    children,
    ...rest
  } = props;

  const resolvedValue =
    controlledValue ?? normalizeSelectedKeys(selectedKeys) ?? defaultValue ?? "";

  const handleValueChange = (next: string) => {
    onValueChange?.(next);
    onSelectionChange?.(next);
    onChange?.({ target: { value: next } });
  };

  const invalid = Boolean(errorMessage) || isInvalid;
  const requiredFlag = isRequired ?? required;

  const selectEl = (
    <ShadcnSelect
      value={resolvedValue}
      onValueChange={handleValueChange}
      disabled={isDisabled}
      {...rest}
    >
      <ShadcnSelectTrigger
        className={cn("w-full", className)}
        disabled={isDisabled}
      >
        <ShadcnSelectValue placeholder={placeholder} />
      </ShadcnSelectTrigger>
      <ShadcnSelectContent>{children}</ShadcnSelectContent>
    </ShadcnSelect>
  );

  if (!label && !description && !errorMessage) {
    return selectEl;
  }

  return (
    <Field data-invalid={invalid} data-readonly={isReadOnly}>
      {label && (
        <FieldLabel>
          {label}
          {requiredFlag && <span className="text-destructive"> *</span>}
        </FieldLabel>
      )}
      {selectEl}
      {description && !errorMessage && (
        <FieldDescription>{description}</FieldDescription>
      )}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </Field>
  );
}

const SelectAny: typeof SelectRoot & {
  (props: SelectSharedProps): React.ReactElement;
} = HeroSelect as never;

export default SelectAny;
