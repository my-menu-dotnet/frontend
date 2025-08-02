type DayOfWeek = 
  | "MONDAY"
  | "TUESDAY" 
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

type BusinessHours = {
  id?: string;
  day_of_week: DayOfWeek;
  opening_time?: string;
  closing_time?: string;
  is_closed: boolean;
};

type BusinessHoursResponse = BusinessHours[];

type BusinessHoursRequest = {
  business_hours: Omit<BusinessHours, 'id'>[];
};

export type { DayOfWeek, BusinessHours, BusinessHoursResponse, BusinessHoursRequest };
