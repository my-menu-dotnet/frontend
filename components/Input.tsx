import {
  Input as NextInput,
  InputProps as NextInputProps,
} from "@nextui-org/react";

type InputProps = NextInputProps & {};

export default function Input({ errorMessage, value = "", ...rest }: InputProps) {
  const isInvalid = Boolean(errorMessage);
  return (
    <NextInput
      value={value}
      errorMessage={errorMessage}
      isInvalid={isInvalid}
      variant="bordered"
      classNames={{
        inputWrapper: "border-1 rounded-lg"
      }}
      {...rest}
    />
  );
}
