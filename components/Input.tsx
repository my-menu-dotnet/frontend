import {
  Input as NextInput,
  InputProps as NextInputProps,
} from "@nextui-org/react";

type InputProps = NextInputProps & {};

export default function Input({ errorMessage, ...rest }: InputProps) {
  const isInvalid = Boolean(errorMessage);
  return (
    <NextInput
      errorMessage={errorMessage}
      isInvalid={isInvalid}
      variant="bordered"
      {...rest}
    />
  );
}
