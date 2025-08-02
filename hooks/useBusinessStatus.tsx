import { BusinessHours, DayOfWeek } from "@/types/api/BusinessHours";
import { useMemo } from "react";

const dayOrder: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY", 
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export const useBusinessStatus = (businessHours: BusinessHours[]) => {
  return useMemo(() => {
    if (!businessHours || businessHours.length === 0) {
      return {
        isOpen: false,
        status: "Horário não definido",
        todayHours: null,
      };
    }

    const now = new Date();
    const currentDay = dayOrder[now.getDay() === 0 ? 6 : now.getDay() - 1];
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const todaySchedule = businessHours.find(
      (h) => h.day_of_week === currentDay
    );

    if (!todaySchedule || todaySchedule.is_closed) {
      return {
        isOpen: false,
        status: "Fechado hoje",
        todayHours: null,
      };
    }

    const openTime = todaySchedule.opening_time
      ? parseInt(todaySchedule.opening_time.split(":")[0]) * 60 +
        parseInt(todaySchedule.opening_time.split(":")[1])
      : 0;
    const closeTime = todaySchedule.closing_time
      ? parseInt(todaySchedule.closing_time.split(":")[0]) * 60 +
        parseInt(todaySchedule.closing_time.split(":")[1])
      : 1440;

    const isOpen = currentTime >= openTime && currentTime <= closeTime;

    return {
      isOpen,
      status: isOpen ? "Aberto agora" : "Fechado agora",
      todayHours: todaySchedule,
    };
  }, [businessHours]);
};
