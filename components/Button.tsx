import {
  Button as NextButton,
  ButtonProps as NextButtonProps,
} from "@nextui-org/button";

type ButtonProps = NextButtonProps & {
  text: string;
  label?: string;
  errorMessage?: string;
};

export default function Button({
  text,
  label,
  errorMessage,
  ...rest
}: ButtonProps) {
  return (
    <NextButton
      color="primary"
      className="text-white font-semibold shadow-sm"
      {...rest}
    >
      {text}
    </NextButton>
  );
}
