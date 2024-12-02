import {
  Input as NextInput,
  InputProps as NextInputProps,
} from "@nextui-org/react";

type InputProps = NextInputProps & {
  mask?: "cpf";
};

export default function Input({
  errorMessage,
  value = "",
  mask,
  onChange,
  ...rest
}: InputProps) {
  const isInvalid = Boolean(errorMessage);

  const hanldeMask = (value: string) => {
    if (mask === "cpf") {
      return value
        .slice(0, 14)
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
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
        inputWrapper: "border-1 rounded-lg",
      }}
      onChange={handleChange}
      {...rest}
    />
  );
}
