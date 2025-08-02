"use client";

import { BusinessHours, DayOfWeek } from "@/types/api/BusinessHours";
import { Switch, TimeInput } from "@nextui-org/react";
import { Time } from "@internationalized/date";
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
    if (businessHours?.opening_time) {
      const [hours, minutes] = businessHours.opening_time.split(':');
      return new Time(parseInt(hours), parseInt(minutes));
    }
    return new Time(8, 0); // Default 08:00
  }, [businessHours?.opening_time]);

  const closingTime = useMemo(() => {
    if (businessHours?.closing_time) {
      const [hours, minutes] = businessHours.closing_time.split(':');
      return new Time(parseInt(hours), parseInt(minutes));
    }
    return new Time(18, 0); // Default 18:00
  }, [businessHours?.closing_time]);

  const handleToggleOpen = (isSelected: boolean) => {
    onChange(dayOfWeek, {
      day_of_week: dayOfWeek,
      is_closed: !isSelected,
      opening_time: isSelected ? formatTime(openingTime) : undefined,
      closing_time: isSelected ? formatTime(closingTime) : undefined,
    });
  };

  const handleOpeningTimeChange = (time: Time | null) => {
    if (!time) return;
    onChange(dayOfWeek, {
      day_of_week: dayOfWeek,
      is_closed: false,
      opening_time: formatTime(time),
      closing_time: formatTime(closingTime),
    });
  };

  const handleClosingTimeChange = (time: Time | null) => {
    if (!time) return;
    onChange(dayOfWeek, {
      day_of_week: dayOfWeek,
      is_closed: false,
      opening_time: formatTime(openingTime),
      closing_time: formatTime(time),
    });
  };

  const formatTime = (time: Time): string => {
    return `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}:00`;
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-32">
          <span className="font-medium text-gray-900">
            {dayNames[dayOfWeek]}
          </span>
        </div>
        
        <Switch
          isSelected={isOpen}
          onValueChange={handleToggleOpen}
          color="primary"
          size="sm"
        />
        
        {isOpen && (
          <div className="flex items-center gap-3 ml-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Abertura:</span>
              <TimeInput
                value={openingTime}
                onChange={handleOpeningTimeChange}
                size="sm"
                className="w-28"
                hourCycle={24}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Fechamento:</span>
              <TimeInput
                value={closingTime}
                onChange={handleClosingTimeChange}
                size="sm"
                className="w-28"
                hourCycle={24}
              />
            </div>
          </div>
        )}
      </div>
      
      {!isOpen && (
        <span className="text-sm text-gray-500 font-medium">Fechado</span>
      )}
    </div>
  );
}
