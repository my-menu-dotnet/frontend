import {
  Textarea as NextTextarea,
  TextAreaProps as NextTextareaProps,
} from "@nextui-org/react";

type TextareaProps = NextTextareaProps & {
  errorMessage?: string;
};

export default function Textarea({ errorMessage, ...rest }: TextareaProps) {
  const isInvalid = Boolean(errorMessage);

  return (
    <NextTextarea
      variant="bordered"
      classNames={{
        inputWrapper: "border-1 rounded-lg",
      }}
      className="w-full"
      isInvalid={isInvalid}
      {...rest}
    />
  );
}
