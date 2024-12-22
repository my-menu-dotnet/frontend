import {
  Checkbox as NextCheckbox,
  CheckboxProps as NextCheckboxProps,
} from "@nextui-org/checkbox";

type CheckboxProps = Omit<NextCheckboxProps, "value"> & {
  value?: string | number | boolean | undefined;
};

export default function Checkbox({ value, ...rest }: CheckboxProps) {
  return (
    <NextCheckbox isSelected={Boolean(value)} value={String(value)} {...rest} />
  );
}
