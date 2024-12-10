import {
  Select as NextSelect,
  SelectProps as NextSelectProps,
} from "@nextui-org/react";

type SelectProps = NextSelectProps & {};

export function Select({ children, ...rest }: SelectProps) {
  return (
    <NextSelect {...rest}>
      {children}
    </NextSelect>
  );
}

export default Select;
