import {
  extendVariants,
  Select,
} from "@nextui-org/react";

export default extendVariants(Select, {
  defaultVariants: {
    variant: "bordered",
    classNames: {
      // @ts-expect-error - Property 'trigger' does not exist on type 'SelectProps'
      trigger: "border-1 rounded-lg",
      listboxWrapper: "border-1 rounded-lg",
    },
    className: "w-full",
  }
});
