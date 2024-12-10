"use client";

import {
  Input as NextInput,
  InputProps as NextInputProps,
} from "@nextui-org/react";
import { useState } from "react";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";

type InputPasswordProps = NextInputProps & {
  label?: string;
  errorMessage?: string;
  value: string;
};

export default function InputPassword({
  errorMessage,
  value = "",
  ...rest
}: InputPasswordProps) {
  const [isVisible, setIsVisible] = useState(false);
  const isInvalid = Boolean(errorMessage);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <NextInput
      value={value}
      errorMessage={errorMessage}
      isInvalid={isInvalid}
      variant="bordered"
      classNames={{
        inputWrapper: "border-1 rounded-lg",
      }}
      type={!isVisible ? "password" : "text"}
      endContent={
        <div onClick={toggleVisibility} className="cursor-pointer">
          {isVisible ? <FaRegEye /> : <FaRegEyeSlash />}
        </div>
      }
      {...rest}
    />
  );
}
