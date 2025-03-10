"use client"
import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type TimeSelectorProps = {
  onSelect: (time: string) => void;
  area: string;
  date?: Date;
}

export function TimeSelector({ onSelect, area, date }: TimeSelectorProps) {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!date) return;

      setIsLoading(true);
      try {
        // 1. Obtener horas reservadas
        console.log(`hola /api/hoursAvailable?area=${encodeURIComponent(area)}&date=${date.toISOString().split('T')[0]}`)
        const response = await fetch(
          `/api/hoursAvailable?area=${encodeURIComponent(area)}&date=${date.toISOString().split('T')[0]}`
        );
        
        if (!response.ok) {
          throw new Error("Error al obtener horarios");
        }

        const bookedTimes = await response.json();

        // 2. Generar todas las horas posibles (08:00 a 20:00)
        const allTimes = Array.from({ length: 13 }, (_, i) => 
          `${String(8 + i).padStart(2, '0')}:00`
        );

        // 3. Filtrar horas disponibles
        const available = allTimes.filter(time => !bookedTimes.includes(time));
        setAvailableTimes(available);

      } catch (error) {
        console.error("Error:", error);
        setAvailableTimes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableTimes();
  }, [area, date]);

  if (!date) {
    return <p>Selecciona una fecha primero</p>;
  }

  return (
    <Card className="w-full my-4">
      <CardContent className="p-4">
        <h3 className="font-medium mb-3">Selecciona una hora:</h3>
        
        {isLoading && <p>Cargando horarios...</p>}
        
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {availableTimes.map(time => (
            <Button 
              key={time} 
              variant="outline" 
              onClick={() => onSelect(time)}
              disabled={isLoading}
              className={isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {time}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}