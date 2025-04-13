import { Switch as UiSwitch } from "@/components/_ui/switch";
import { FormControl, FormItem, FormLabel, FormMessage } from "../_ui/form";
import { ComponentProps, useMemo } from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

type CheckboxProps = ComponentProps<typeof SwitchPrimitive.Root> & {
  children?: React.ReactNode | string;
  label?: string;
  noForm?: boolean;
};

export default function Switch({
  children,
  label,
  noForm = false,
  value,
  onChange,
  ...rest
}: CheckboxProps) {
  const id = useMemo(() => Math.random().toString(36).substring(2, 9), []);

  return !noForm ? (
    <FormItem>
      <div className="flex items-center space-x-2">
        <FormControl>
          <UiSwitch
            // @ts-expect-error - it doesn't have a type for checked
            checked={value}
            // @ts-expect-error - it doesn't have a type for checked
            onCheckedChange={onChange}
            id={id}
            {...rest}
          />
        </FormControl>
        <FormLabel
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {children}
          {label}
        </FormLabel>
      </div>
      <FormMessage />
    </FormItem>
  ) : (
    <div className="flex items-center space-x-2">
      <UiSwitch id={id} {...rest} />
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {children}
        {label}
      </label>
    </div>
  );
}

Switch.displayName = "Switch";
