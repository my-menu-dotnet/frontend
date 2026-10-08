import * as React from "react";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  /** Optional visible label. When set, the textarea is wrapped in a Field. */
  label?: string;
  /** Error message — drives both `aria-invalid` and the visible error text. */
  errorMessage?: string;
  /** Optional helper text shown below the textarea. */
  description?: string;
  /** Mark the field as required (also adds the visual indicator). */
  required?: boolean;
  /** Hero-UI required alias. */
  isRequired?: boolean;
  /** Hero-UI disabled alias. */
  isDisabled?: boolean;
  /** Hero-UI readonly alias. */
  isReadOnly?: boolean;
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      errorMessage,
      description,
      required,
      isRequired,
      isDisabled,
      isReadOnly,
      className,
      rows = 4,
      ...rest
    },
    ref,
  ) {
    const invalid = Boolean(errorMessage);
    const resolvedRequired = isRequired ?? required;

    const textareaEl = (
      <ShadcnTextarea
        ref={ref}
        rows={rows}
        aria-invalid={invalid}
        disabled={isDisabled}
        readOnly={isReadOnly}
        required={resolvedRequired}
        className={cn("min-h-20 w-full rounded-lg", className)}
        {...rest}
      />
    );

    if (!label && !description && !errorMessage) {
      return textareaEl;
    }

    return (
      <Field data-invalid={invalid}>
        {label && (
          <FieldLabel htmlFor={rest.id}>
            {label}
            {resolvedRequired && <span className="text-destructive"> *</span>}
          </FieldLabel>
        )}
        {textareaEl}
        {description && !errorMessage && (
          <FieldDescription>{description}</FieldDescription>
        )}
        {errorMessage && <FieldError>{errorMessage}</FieldError>}
      </Field>
    );
  },
);

export default Textarea;
