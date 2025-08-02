"use client";

import { BusinessHours, DayOfWeek } from "@/types/api/BusinessHours";
import { useMemo } from "react";

type BusinessStatusProps = {
  businessHours: BusinessHours[];
  className?: string;
  showIcon?: boolean;
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

export default function BusinessStatus({
  businessHours,
  className = "",
  showIcon = true,
}: BusinessStatusProps) {
  const { isCurrentlyOpen, statusText, statusColor } = useMemo(() => {
    if (businessHours.length === 0) {
      return {
        isCurrentlyOpen: false,
        statusText: "Horário não informado",
        statusColor: "text-gray-500",
      };
    }

    const now = new Date();
    const currentDay = dayOrder[now.getDay() === 0 ? 6 : now.getDay() - 1]; // Adjust for Sunday = 0
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Minutes since midnight
    
    const todaySchedule = businessHours.find(h => h.day_of_week === currentDay);
    
    if (!todaySchedule || todaySchedule.is_closed) {
      return {
        isCurrentlyOpen: false,
        statusText: "Fechado hoje",
        statusColor: "text-red-600",
      };
    }
    
    if (todaySchedule.opening_time && todaySchedule.closing_time) {
      const [openHour, openMin] = todaySchedule.opening_time.split(':').map(Number);
      const [closeHour, closeMin] = todaySchedule.closing_time.split(':').map(Number);
      
      const openTime = openHour * 60 + openMin;
      const closeTime = closeHour * 60 + closeMin;
      
      const isOpen = currentTime >= openTime && currentTime <= closeTime;
      
      return {
        isCurrentlyOpen: isOpen,
        statusText: isOpen ? "Aberto agora" : "Fechado agora",
        statusColor: isOpen ? "text-green-600" : "text-red-600",
      };
    }
    
    return {
      isCurrentlyOpen: false,
      statusText: "Horário não definido",
      statusColor: "text-gray-500",
    };
  }, [businessHours]);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {showIcon && (
        <div 
          className={`w-2 h-2 rounded-full ${
            isCurrentlyOpen ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
      )}
      <span className={`text-xs font-medium ${statusColor}`}>
        {statusText}
      </span>
    </div>
  );
}
