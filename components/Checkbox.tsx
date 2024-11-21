import {
  Checkbox as NextCheckbox,
  CheckboxProps as NextCheckboxProps,
} from "@nextui-org/checkbox";

type CheckboxProps = NextCheckboxProps & {};

export default function Checkbox({ ...rest }: CheckboxProps) {
  return <NextCheckbox {...rest} />;
}
