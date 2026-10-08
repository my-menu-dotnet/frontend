import * as React from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input as ShadcnInput } from "@/components/ui/input";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

export type InputPasswordProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "endContent"
> & {
  /** Optional visible label. */
  label?: string;
  /** Error message — drives both `aria-invalid` and the visible error text. */
  errorMessage?: string;
  /** Optional helper text shown below the input. */
  description?: string;
  /** Make the field required (also adds the visual indicator). */
  required?: boolean;
};

/**
 * Password input with a built-in visibility toggle rendered via InputGroupAddon.
 */
export default function InputPassword({
  label,
  errorMessage,
  description,
  required,
  className,
  value,
  onChange,
  ...rest
}: InputPasswordProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const invalid = Boolean(errorMessage);

  const inputEl = (
    <InputGroup>
      <ShadcnInput
        type={isVisible ? "text" : "password"}
        value={value}
        onChange={onChange}
        aria-invalid={invalid}
        required={required}
        className={cn("h-10 w-full rounded-lg", className)}
        {...rest}
      />
      <InputGroupAddon align="inline-end">
        <button
          type="button"
          aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
          onClick={() => setIsVisible((v) => !v)}
          className="cursor-pointer text-muted-foreground hover:text-foreground focus-visible:outline-none"
        >
          {isVisible ? <FaRegEye /> : <FaRegEyeSlash />}
        </button>
      </InputGroupAddon>
    </InputGroup>
  );

  if (!label && !description && !errorMessage) {
    return inputEl;
  }

  return (
    <Field data-invalid={invalid}>
      {label && (
        <FieldLabel htmlFor={rest.id}>
          {label}
          {required && <span className="text-destructive"> *</span>}
        </FieldLabel>
      )}
      {inputEl}
      {description && !errorMessage && (
        <FieldDescription>{description}</FieldDescription>
      )}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </Field>
  );
}
