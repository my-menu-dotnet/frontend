import Button from "@/components/Button";

type PeriodFilterProps = {
  selectedPeriod: number;
  onPeriodChange: (period: number) => void;
  className?: string;
};

const periods = [
  { value: 1, label: "1 mês" },
  { value: 3, label: "3 meses" },
  { value: 6, label: "6 meses" },
  { value: 12, label: "1 ano" },
];

export default function PeriodFilter({
  selectedPeriod,
  onPeriodChange,
  className = "",
}: PeriodFilterProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {periods.map((period) => (
        <Button
          key={period.value}
          size="sm"
          variant={selectedPeriod === period.value ? "default" : "outline"}
          onClick={() => onPeriodChange(period.value)}
          className="min-w-16"
        >
          {period.label}
        </Button>
      ))}
    </div>
  );
}
