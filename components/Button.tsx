import {
  Button as NextButton,
  ButtonProps as NextButtonProps,
} from "@nextui-org/button";

export type ButtonProps = NextButtonProps & {
  text?: string;
  children?: React.ReactNode;
};

export default function Button({ text, children, ...rest }: ButtonProps) {
  return (
    <NextButton
      color="primary"
      className="font-semibold shadow-sm h-10 rounded-md"
      {...rest}
    >
      {text}
      {children}
    </NextButton>
  );
}
