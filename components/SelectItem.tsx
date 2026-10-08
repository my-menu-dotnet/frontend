import * as React from "react";
import { SelectItem as ShadcnSelectItem } from "@/components/ui/select";

export type SelectItemProps = Omit<
  React.ComponentProps<typeof ShadcnSelectItem>,
  "value" | "children"
> & {
  /** Hero-UI passthrough — used as the value if `value` is missing. */
  key?: string;
  /** Value submitted when the item is selected. */
  value: string;
  /** Hero-UI disabled alias. */
  isDisabled?: boolean;
  /** Native disabled alias — Radix/SelectItem accepts `disabled` directly. */
  disabled?: boolean;
  /** Visible content. */
  children?: React.ReactNode;
};

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  function SelectItem({ isDisabled, disabled, children, ...rest }, ref) {
    return (
      <ShadcnSelectItem
        ref={ref}
        disabled={isDisabled ?? disabled}
        {...rest}
      >
        {children}
      </ShadcnSelectItem>
    );
  },
);

export default SelectItem;
