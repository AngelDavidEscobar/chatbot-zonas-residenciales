"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin } from "lucide-react"

type ConfirmationDialogProps = {
  reservation: {
    celular?: string
    cedula?: string
    area?: string
    date?: Date
    time?: string
  }
  onConfirm: (confirmed: boolean) => void
}

const confirmReservation = async (
  celular: string,
  cedula: string,
  area: string,
  time: string,
  date?: Date,
  onConfirm?: (confirmed: boolean) => void
) => {
  try {
    const formattedDate = date?.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    const response = await fetch('/api/reservations', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        celular,
        cedula,
        area_comun: area,
        fecha_reservacion: formattedDate,
        hora_reservada: time,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al confirmar reserva');
    }

    if (onConfirm) onConfirm(true);
  } catch (error) {
    console.error('Error:', error);
    if (onConfirm) onConfirm(false);
  }
};

export function ConfirmationDialog({ reservation, onConfirm, cedula, celular }: ConfirmationDialogProps & { cedula: string, celular: string }) {
  reservation.cedula = cedula;
  reservation.celular = celular;
  return (
    <Card className="w-full my-4">
      <CardContent className="p-4 pt-6">
        <h3 className="font-medium text-lg mb-4 text-center">Confirma tu reserva</h3>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Área</p>
              <p className="font-medium">{reservation.area}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Fecha</p>
              <p className="font-medium">{reservation.date?.toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Hora</p>
              <p className="font-medium">{reservation.time}</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-4 text-center">
          Al confirmar, aceptas las normas de uso de las áreas comunes
        </p>
      </CardContent>

      <CardFooter className="flex justify-between gap-2 p-4 flex-col">
        <Button
          className="w-full"
          onClick={async () => {
            await confirmReservation(
              reservation.celular || '3123213211',
              reservation.cedula || '1000177177', 
              reservation.area || '',
              reservation.time || '',
              reservation.date || new Date(),
             
            );
            onConfirm(true);
          }}
        >
          Confirmar Reserva
        </Button>

        <Button variant="outline" className="w-full" onClick={() => onConfirm(false)}>
          Cancelar
        </Button>
      </CardFooter>
    </Card>
  );
}