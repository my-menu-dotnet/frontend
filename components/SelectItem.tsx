import {
  SelectItem as NextSelectItem,
  SelectItemProps as NextSelectItemProps,
} from "@nextui-org/react";

type SelectItemPropsas = NextSelectItemProps & {};

export default function SelectItem({ children, ...rest }: SelectItemPropsas) {
  return <NextSelectItem {...rest}>{children}</NextSelectItem>;
}
