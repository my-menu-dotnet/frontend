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
      className="font-semibold shadow-sm h-12"
      {...rest}
    >
      {text}
    </NextButton>
  );
}
