import { Checkbox as UiCheckbox } from "@/components/_ui/checkbox";
import { useMemo } from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "../_ui/form";

type CheckboxProps = {
  children: React.ReactNode | string;
};

export default function Checkbox({ children }: CheckboxProps) {
  const id = useMemo(() => Math.random().toString(36).substring(2, 9), []);

  return (
    <FormItem>
      <div className="flex items-center space-x-2">
        <FormControl>
          <UiCheckbox id={id} />
        </FormControl>
        <FormLabel
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {children}
        </FormLabel>
      </div>
      <FormMessage />
    </FormItem>
  );
}
