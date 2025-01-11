import { masks } from "@/utils/mask";
import {
  Input as NextInput,
  InputProps as NextInputProps,
} from "@nextui-org/react";

type InputProps = NextInputProps & {
  mask?: "cpf" | "cep" | "phone";
};

export default function Input({
  errorMessage,
  value = "",
  mask,
  onChange,
  classNames,
  ...rest
}: InputProps) {
  const isInvalid = Boolean(errorMessage);

  const hanldeMask = (value: string) => {
    if (mask) {
      return masks[mask](value);
    }
    return value;
  };

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newEvent = {
      ...event,
      target: {
        ...event.target,
        value: hanldeMask(event.target.value),
      },
    };
    onChange?.(newEvent);
  }

  return (
    <NextInput
      value={value || ""}
      errorMessage={errorMessage}
      isInvalid={isInvalid}
      variant="bordered"
      classNames={{
        ...classNames,
        inputWrapper: `border-1 rounded-lg ${classNames?.inputWrapper}`,
      }}
      onChange={handleChange}
      {...rest}
    />
  );
}
