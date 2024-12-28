import {DateRangePicker, extendVariants} from "@nextui-org/react";

export default extendVariants(DateRangePicker, {
  defaultVariants: {
    variant: "bordered",
    className: "w-full",
    classNames: {
      // @ts-expect-error - Property 'inputWrapper' does not exist on type 'DateRangePickerProps'
      inputWrapper: "border-1"
    }
  }
});