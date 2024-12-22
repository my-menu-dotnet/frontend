import {
  Switch as NextSwitch,
  SwitchProps as NextSwitchProps,
} from "@nextui-org/react";

type SwitchProps = NextSwitchProps & {};

export default function Switch({ children, ...rest }: SwitchProps) {
  return <NextSwitch {...rest}>{children}</NextSwitch>;
}
