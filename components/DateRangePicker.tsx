import * as React from "react";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

/**
 * ISO-8601 date strings (`YYYY-MM-DD`). Native `<input type="date">` already
 * negotiates this format, so the wrapper can pass values through directly.
 */
export type DateRange = { start?: string; end?: string };

export type DateRangePickerProps = {
  /** Controlled range value. */
  value?: DateRange;
  /** Change handler. Receives the new range whenever either side changes. */
  onChange?: (range: DateRange) => void;
  /** Optional visible label. */
  label?: string;
  /** Error message — drives both `aria-invalid` and the visible error text. */
  errorMessage?: string;
  /** Optional helper text shown below the picker. */
  description?: string;
  /** Custom className for the outer wrapper. */
  className?: string;
  /** Disable both date inputs. */
  disabled?: boolean;
  /** Make the field required. */
  required?: boolean;
};

/**
 * Minimal range picker built from two native date inputs.
 *
 * Hero-UI's `DateRangePicker` returned `@internationalized/date` `CalendarDate`
 * values, which we no longer carry. The wrapper now uses ISO strings — the
 * backend only needs the date portion anyway.
 */
export default function DateRangePicker({
  value,
  onChange,
  label,
  errorMessage,
  description,
  className,
  disabled,
  required,
}: DateRangePickerProps) {
  const invalid = Boolean(errorMessage);

  return (
    <Field data-invalid={invalid} className={cn("w-full", className)}>
      {label && (
        <FieldLabel>
          {label}
          {required && <span className="text-destructive"> *</span>}
        </FieldLabel>
      )}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <span className="text-xs text-muted-foreground">De</span>
          </InputGroupAddon>
          <input
            type="date"
            aria-label="Data inicial"
            value={value?.start ?? ""}
            disabled={disabled}
            onChange={(e) =>
              onChange?.({ start: e.target.value, end: value?.end })
            }
            className={cn(
              "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive",
            )}
          />
        </InputGroup>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <span className="text-xs text-muted-foreground">Até</span>
          </InputGroupAddon>
          <input
            type="date"
            aria-label="Data final"
            value={value?.end ?? ""}
            disabled={disabled}
            onChange={(e) =>
              onChange?.({ start: value?.start, end: e.target.value })
            }
            className={cn(
              "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive",
            )}
          />
        </InputGroup>
      </div>
      {description && !errorMessage && (
        <FieldDescription>{description}</FieldDescription>
      )}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </Field>
  );
}
