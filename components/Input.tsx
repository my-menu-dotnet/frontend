import * as React from "react";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input as ShadcnInput } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { masks } from "@/utils/mask";
import { cn } from "@/lib/utils";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "required" | "value"
> & {
  /** Optional visible label. */
  label?: string;
  /** Error message — drives both `aria-invalid` and the visible error text. */
  errorMessage?: string;
  /** Optional helper text shown below the input. */
  description?: string;
  /** Brand-specific input mask. */
  mask?: "cpf" | "cep" | "phone";
  /** Optional element rendered on the right side of the input. */
  endContent?: React.ReactNode;
  /** Optional element rendered on the left side of the input. */
  startContent?: React.ReactNode;
  /** Make the field required (also adds the visual indicator). */
  required?: boolean;
  /** Hero-UI alias for `required`. */
  isRequired?: boolean;
  /** Hero-UI alias for `disabled`. */
  isDisabled?: boolean;
  /** Hero-UI alias for `readOnly`. */
  isReadOnly?: boolean;
  /** Change handler. Receives a normal `ChangeEvent` like a native input. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /** Hero-UI-style value: can be string or number (numbers are coerced to string). */
  value?: string | number | readonly string[] | undefined;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    errorMessage,
    description,
    mask,
    endContent,
    startContent,
    required,
    isRequired,
    isDisabled,
    isReadOnly,
    className,
    value,
    onChange,
    type = "text",
    ...rest
  },
  ref,
) {
  const invalid = Boolean(errorMessage);
  const resolvedRequired = isRequired ?? required;
  const resolvedDisabled = isDisabled ?? (rest as { disabled?: boolean }).disabled;
  const resolvedReadOnly = isReadOnly ?? (rest as { readOnly?: boolean }).readOnly;

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (mask) {
      const masked = masks[mask](event.target.value);
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )?.set;
      nativeSetter?.call(event.target, masked);
      event.target.value = masked;
    }
    onChange?.(event);
  };

  const stringValue = value === undefined || value === null
    ? value
    : String(value);

  const baseProps = {
    ref,
    value: stringValue as React.InputHTMLAttributes<HTMLInputElement>["value"],
    onChange: handleChange,
    type,
    "aria-invalid": invalid,
    required: resolvedRequired,
    disabled: resolvedDisabled,
    readOnly: resolvedReadOnly,
  } as const;

  const shadcnProps = {
    ...baseProps,
    className: cn("h-10 w-full rounded-lg", className),
  } as const;

  const groupProps = {
    ...baseProps,
    className: cn("h-10", className),
  } as const;

  const inputEl = endContent || startContent ? (
    <InputGroup>
      {startContent && (
        <InputGroupAddon align="inline-start">{startContent}</InputGroupAddon>
      )}
      <InputGroupInput {...groupProps} {...rest} />
      {endContent && (
        <InputGroupAddon align="inline-end">{endContent}</InputGroupAddon>
      )}
    </InputGroup>
  ) : (
    <ShadcnInput {...shadcnProps} {...rest} />
  );

  if (!label && !description && !errorMessage) {
    return inputEl;
  }

  return (
    <Field data-invalid={invalid}>
      {label && (
        <FieldLabel htmlFor={rest.id}>
          {label}
          {resolvedRequired && <span className="text-destructive"> *</span>}
        </FieldLabel>
      )}
      {inputEl}
      {description && !errorMessage && (
        <FieldDescription>{description}</FieldDescription>
      )}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </Field>
  );
});

export default Input;
