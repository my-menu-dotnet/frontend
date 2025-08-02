"use client";

import { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import Block from "@/components/Block";
import DayScheduleEditor from "@/components/Dashboard/BusinessHours/DayScheduleEditor";
import useBusinessHours from "@/hooks/queries/useBusinessHours";
import useUpdateBusinessHours from "@/hooks/mutate/useUpdateBusinessHours";
import { BusinessHours, DayOfWeek } from "@/types/api/BusinessHours";
import { FiClock, FiSave } from "react-icons/fi";

const daysOfWeek: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY", 
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export default function BusinessHoursPage() {
  const { data: businessHours, isLoading } = useBusinessHours();
  const updateBusinessHours = useUpdateBusinessHours();
  
  const [localHours, setLocalHours] = useState<Record<DayOfWeek, Omit<BusinessHours, 'id'>>>({
    MONDAY: { day_of_week: "MONDAY", is_closed: false, opening_time: "08:00:00", closing_time: "18:00:00" },
    TUESDAY: { day_of_week: "TUESDAY", is_closed: false, opening_time: "08:00:00", closing_time: "18:00:00" },
    WEDNESDAY: { day_of_week: "WEDNESDAY", is_closed: false, opening_time: "08:00:00", closing_time: "18:00:00" },
    THURSDAY: { day_of_week: "THURSDAY", is_closed: false, opening_time: "08:00:00", closing_time: "18:00:00" },
    FRIDAY: { day_of_week: "FRIDAY", is_closed: false, opening_time: "08:00:00", closing_time: "18:00:00" },
    SATURDAY: { day_of_week: "SATURDAY", is_closed: false, opening_time: "08:00:00", closing_time: "18:00:00" },
    SUNDAY: { day_of_week: "SUNDAY", is_closed: true },
  });

  // Update local state when data is loaded
  useEffect(() => {
    if (businessHours) {
      const hoursMap: Record<DayOfWeek, Omit<BusinessHours, 'id'>> = {} as Record<DayOfWeek, Omit<BusinessHours, 'id'>>;
      
      daysOfWeek.forEach(day => {
        const dayData = businessHours.find(h => h.day_of_week === day);
        if (dayData) {
          hoursMap[day] = {
            day_of_week: day,
            is_closed: dayData.is_closed,
            opening_time: dayData.opening_time,
            closing_time: dayData.closing_time,
          };
        } else {
          // Default values for days not in the response
          hoursMap[day] = {
            day_of_week: day,
            is_closed: day === "SUNDAY",
            opening_time: day !== "SUNDAY" ? "08:00:00" : undefined,
            closing_time: day !== "SUNDAY" ? "18:00:00" : undefined,
          };
        }
      });
      
      setLocalHours(hoursMap);
    }
  }, [businessHours]);

  const handleDayChange = (dayOfWeek: DayOfWeek, hours: Omit<BusinessHours, 'id'>) => {
    setLocalHours(prev => ({
      ...prev,
      [dayOfWeek]: hours,
    }));
  };

  const handleSave = () => {
    const business_hours = Object.values(localHours);
    updateBusinessHours.mutate({ business_hours });
  };

  const handleQuickActions = {
    openAllWeek: () => {
      const newHours = { ...localHours };
      daysOfWeek.forEach(day => {
        newHours[day] = {
          day_of_week: day,
          is_closed: false,
          opening_time: "08:00:00",
          closing_time: "18:00:00",
        };
      });
      setLocalHours(newHours);
    },
    
    openWeekdays: () => {
      const newHours = { ...localHours };
      daysOfWeek.forEach(day => {
        if (day === "SATURDAY" || day === "SUNDAY") {
          newHours[day] = {
            day_of_week: day,
            is_closed: true,
          };
        } else {
          newHours[day] = {
            day_of_week: day,
            is_closed: false,
            opening_time: "08:00:00",
            closing_time: "18:00:00",
          };
        }
      });
      setLocalHours(newHours);
    },
    
    closeSunday: () => {
      setLocalHours(prev => ({
        ...prev,
        SUNDAY: {
          day_of_week: "SUNDAY",
          is_closed: true,
        },
      }));
    },
  };

  return (
    <main className="flex justify-center">
      <Block className="flex flex-col gap-6 w-full max-w-4xl mb-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <FiClock className="text-2xl text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Horários de Funcionamento
              </h1>
              <p className="text-gray-600 mt-1">
                Configure os horários de funcionamento da sua empresa
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <Block className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Ações Rápidas</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="bordered"
              onPress={handleQuickActions.openAllWeek}
            >
              Abrir Todos os Dias
            </Button>
            <Button
              size="sm"
              variant="bordered"
              onPress={handleQuickActions.openWeekdays}
            >
              Só Dias Úteis
            </Button>
            <Button
              size="sm"
              variant="bordered"
              onPress={handleQuickActions.closeSunday}
            >
              Fechar Domingo
            </Button>
          </div>
        </Block>

        {/* Schedule Editor */}
        <Block>
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">
              Configurar Horários por Dia
            </h3>
            
            {daysOfWeek.map((day) => (
              <DayScheduleEditor
                key={day}
                dayOfWeek={day}
                businessHours={localHours[day]}
                onChange={handleDayChange}
              />
            ))}
          </div>
        </Block>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            color="primary"
            size="lg"
            startContent={<FiSave />}
            onPress={handleSave}
            isLoading={updateBusinessHours.isPending}
            isDisabled={isLoading}
          >
            Salvar Horários
          </Button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Dica</h4>
            <p className="text-sm text-blue-800">
              Use as ações rápidas para configurar padrões comuns de funcionamento.
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-semibold text-green-900 mb-2">📱 Visibilidade</h4>
            <p className="text-sm text-green-800">
              Os horários aparecerão no cardápio digital para seus clientes.
            </p>
          </div>
        </div>
      </Block>
    </main>
  );
}
