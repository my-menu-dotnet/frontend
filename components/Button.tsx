import {
  Button as NextButton,
  ButtonProps as NextButtonProps,
} from "@nextui-org/button";

type ButtonProps = NextButtonProps & {
  text: string;
};

export default function Button({ text, ...rest }: ButtonProps) {
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
