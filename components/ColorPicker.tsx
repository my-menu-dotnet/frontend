"use client";

import { useRef } from "react";
import { ControllerRenderProps } from "react-hook-form";
import Input from "./Input";
import { InputProps } from "@nextui-org/react";

type ColorPickerProps = ControllerRenderProps &
  InputProps & {
    label: string;
    placeholder?: string;
  };

export default function ColorPicker({
  label,
  placeholder,
  errorMessage,
  ...props
}: ColorPickerProps) {
  const { onChange, onBlur, value = "", disabled, name } = props;
  const colorRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Input
        label={label}
        placeholder={placeholder}
        onClick={() => colorRef.current?.click()}
        isReadOnly
        isDisabled={disabled}
        {...props}
        value={props.value}
        endContent={
          <div className="absolute top-0 right-0 flex justify-center items-center h-full border-l border-gray-200 bg-gray-100 px-2">
            <input
              type="color"
              className="bg-transparent"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              name={name}
              ref={colorRef}
            />
          </div>
        }
      />
    </>
  );
}
