"use client";

import { BusinessHours, DayOfWeek } from "@/types/api/BusinessHours";
import { useMemo } from "react";
import { FiClock } from "react-icons/fi";
import { IoChevronDownSharp } from "react-icons/io5";

type BusinessHoursDisplayProps = {
  businessHours: BusinessHours[];
  className?: string;
  color?: string;
};

const dayNames: Record<DayOfWeek, string> = {
  MONDAY: "Seg",
  TUESDAY: "Ter",
  WEDNESDAY: "Qua",
  THURSDAY: "Qui",
  FRIDAY: "Sex",
  SATURDAY: "Sáb",
  SUNDAY: "Dom",
};

const dayOrder: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export default function BusinessHoursDisplay({
  businessHours,
  className = "",
  color = "#000",
}: BusinessHoursDisplayProps) {
  const { isCurrentlyOpen, currentStatus, todayHours } = useMemo(() => {
    const now = new Date();
    const currentDay = dayOrder[now.getDay() === 0 ? 6 : now.getDay() - 1]; // Adjust for Sunday = 0
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Minutes since midnight

    const todaySchedule = businessHours.find(
      (h) => h.day_of_week === currentDay
    );

    if (!todaySchedule || todaySchedule.is_closed) {
      return {
        isCurrentlyOpen: false,
        currentStatus: "Fechado hoje",
        todayHours: null,
      };
    }

    if (todaySchedule.opening_time && todaySchedule.closing_time) {
      const [openHour, openMin] = todaySchedule.opening_time
        .split(":")
        .map(Number);
      const [closeHour, closeMin] = todaySchedule.closing_time
        .split(":")
        .map(Number);

      const openTime = openHour * 60 + openMin;
      const closeTime = closeHour * 60 + closeMin;

      const isOpen = currentTime >= openTime && currentTime <= closeTime;

      return {
        isCurrentlyOpen: isOpen,
        currentStatus: isOpen ? "Aberto agora" : "Fechado agora",
        todayHours: {
          opening: todaySchedule.opening_time.substring(0, 5),
          closing: todaySchedule.closing_time.substring(0, 5),
        },
      };
    }

    return {
      isCurrentlyOpen: false,
      currentStatus: "Horário não definido",
      todayHours: null,
    };
  }, [businessHours]);

  const sortedHours = useMemo(() => {
    return dayOrder
      .map((day) => {
        const daySchedule = businessHours.find((h) => h.day_of_week === day);
        return {
          day,
          schedule: daySchedule,
        };
      })
      .filter((item) => item.schedule);
  }, [businessHours]);

  if (businessHours.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      {/* Status Atual */}
      <div className="flex items-center gap-2 mb-2">
        <FiClock size={16} style={{ color }} />
        <span
          className={`text-sm font-medium ${
            isCurrentlyOpen ? "text-green-600" : "text-red-600"
          }`}
        >
          {currentStatus}
        </span>
        {todayHours && (
          <span className="text-sm text-gray-600">
            • {todayHours.opening} - {todayHours.closing}
          </span>
        )}
      </div>

      {/* Lista de Horários - Versão Compacta */}
      <details className="group">
        <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800 list-none flex items-center gap-1">
          <span>Ver todos os horários</span>
          <span className="transition-transform duration-200 group-open:rotate-180">
            <IoChevronDownSharp size={14} />
          </span>
        </summary>

        <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
          <div className="grid grid-cols-1 gap-1">
            {sortedHours.map(({ day, schedule }) => (
              <div key={day} className="flex justify-between items-center">
                <span className="font-medium text-gray-700">
                  {dayNames[day]}
                </span>
                <span className="text-gray-600">
                  {schedule?.is_closed
                    ? "Fechado"
                    : `${schedule?.opening_time?.substring(
                        0,
                        5
                      )} - ${schedule?.closing_time?.substring(0, 5)}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </details>
    </div>
  );
}
