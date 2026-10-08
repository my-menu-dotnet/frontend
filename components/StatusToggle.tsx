import { Field, FieldLabel } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

export type StatusValue = "ACTIVE" | "INACTIVE";

type StatusToggleProps = {
  value: StatusValue;
  onChange: (value: StatusValue) => void;
  /** Optional label rendered above the group. */
  label?: string;
  /** Optional className for the toggle group container. */
  className?: string;
  /** Hide the "Ativo"/"Inativo" text inside the buttons. */
  hideLabels?: boolean;
  disabled?: boolean;
  "data-test"?: string;
};

const STATUS_OPTIONS: Array<{ value: StatusValue; label: string; test: string }> = [
  { value: "ACTIVE", label: "Ativo", test: "status-active" },
  { value: "INACTIVE", label: "Inativo", test: "status-inactive" },
];

/**
 * Radio-like status toggle. Renders two segmented buttons (Ativo / Inativo)
 * backed by shadcn's `ToggleGroup` with `type="single"`. The selected state
 * is highlighted with the primary color so it's visually obvious which option
 * is active — unlike a `Switch`, which only renders a toggle thumb.
 */
export function StatusToggle({
  value,
  onChange,
  label = "Status",
  className,
  hideLabels = false,
  disabled,
  "data-test": dataTest,
}: StatusToggleProps) {
  return (
    <Field
      data-disabled={disabled}
      className={cn("gap-2", className)}
      data-test={dataTest}
    >
      {!hideLabels && <FieldLabel>{label}</FieldLabel>}
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(v) => {
          if (v) onChange(v as StatusValue);
        }}
        variant="outline"
        size="sm"
        disabled={disabled}
        className="w-full"
      >
        {STATUS_OPTIONS.map((opt) => (
          <ToggleGroupItem
            key={opt.value}
            value={opt.value}
            data-test={opt.test}
            aria-label={opt.label}
            className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            {opt.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </Field>
  );
}

export default StatusToggle;
