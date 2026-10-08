import Switch from "@/components/Switch";
import { Input } from "@/components/ui/input";
import { BusinessHours, DayOfWeek } from "@/types/api/BusinessHours";
import { useMemo } from "react";

type DayScheduleEditorProps = {
  dayOfWeek: DayOfWeek;
  businessHours: BusinessHours | undefined;
  onChange: (dayOfWeek: DayOfWeek, hours: Omit<BusinessHours, 'id'>) => void;
};

const dayNames: Record<DayOfWeek, string> = {
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

export default function DayScheduleEditor({
  dayOfWeek,
  businessHours,
  onChange,
}: DayScheduleEditorProps) {
  const isOpen = !businessHours?.is_closed;

  const openingTime = useMemo(() => {
    return businessHours?.opening_time || "08:00:00";
  }, [businessHours?.opening_time]);

  const closingTime = useMemo(() => {
    return businessHours?.closing_time || "18:00:00";
  }, [businessHours?.closing_time]);

  const handleToggleOpen = (open: boolean) => {
    onChange(dayOfWeek, {
      day_of_week: dayOfWeek,
      is_closed: !open,
      opening_time: open ? openingTime : undefined,
      closing_time: open ? closingTime : undefined,
    });
  };

  const handleOpeningTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(dayOfWeek, {
      day_of_week: dayOfWeek,
      is_closed: false,
      opening_time: e.target.value + ":00",
      closing_time: closingTime,
    });
  };

  const handleClosingTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(dayOfWeek, {
      day_of_week: dayOfWeek,
      is_closed: false,
      opening_time: openingTime,
      closing_time: e.target.value + ":00",
    });
  };

  return (
    <div className="flex items-center justify-between p-4 border border-muted rounded-lg">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-32">
          <span className="font-medium text-foreground">
            {dayNames[dayOfWeek]}
          </span>
        </div>

        <Switch
          checked={isOpen}
          onCheckedChange={handleToggleOpen}
          size="sm"
        />

        {isOpen && (
          <div className="flex items-center gap-3 ml-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Abertura:</span>
              <Input
                type="time"
                value={openingTime.slice(0, 5)}
                onChange={handleOpeningTimeChange}
                className="w-28"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Fechamento:</span>
              <Input
                type="time"
                value={closingTime.slice(0, 5)}
                onChange={handleClosingTimeChange}
                className="w-28"
              />
            </div>
          </div>
        )}
      </div>

      {!isOpen && (
        <span className="text-sm text-muted-foreground font-medium">Fechado</span>
      )}
    </div>
  );
}
