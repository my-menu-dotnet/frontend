import {
  Input as NextInput,
  InputProps as NextInputProps,
} from "@nextui-org/react";
import { useState } from "react";
import EyeSlashFilledIcon from "./icons/EyeSlashFilledIcon";
import EyeFilledIcon from "./icons/EyeFilledIcon";

type InputPasswordProps = NextInputProps & {
  label?: string;
  errorMessage?: string;
  value: string;
};

export default function InputPassword({
  errorMessage,
  ...rest
}: InputPasswordProps) {
  const [isVisible, setIsVisible] = useState(false);
  const isInvalid = Boolean(errorMessage);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <NextInput
      errorMessage={errorMessage}
      isInvalid={isInvalid}
      variant="bordered"
      type={!isVisible ? "password" : "text"}
      endContent={
        <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
          {isVisible ? (
            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      {...rest}
    />
  );
}
