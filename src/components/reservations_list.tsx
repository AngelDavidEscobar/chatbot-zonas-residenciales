"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, X } from "lucide-react"
import { useEffect, useState } from "react"

type Reservation = {
  id: string
  area: string
  date: Date
  time: string
  status: "confirmed" | "pending" | "cancelled"
}

type ReservationsListProps = {
  onClose: () => void
  onUpdate: (id: string) => void
  onCancel: (id: string) => void
  cedula: string
}

const cancelReservation = async (id: string) => {
  const response = await fetch(`/api/cancelReservations?id=${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error("Error al cancelar reserva");
  }
  return response.json();
};

export function ReservationsList({ onClose, onCancel,onUpdate, cedula }: ReservationsListProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(`/api/getUserReservations?cedula=${cedula}`);
        const reservas = await response.json();
        setReservations(reservas);
      } catch (error) {
        console.error('Error al obtener reservas:', error);
      }
    };

    fetchReservations();
  }, [cedula]);

  const handleCancelReservation = async (id: string) => {
    try {
      await cancelReservation(id);
      // Actualizar el estado local eliminando la reserva cancelada
      setReservations((prevReservations) =>
        prevReservations.filter((reservation) => reservation.id !== id)
      );
      onCancel(id); 
    } catch (error) {
      console.error('Error al cancelar la reserva:', error);
    }
  };

  const confirmCancelReservation = (id: string) => {
    const isConfirmed = window.confirm("¿Estás seguro de que deseas cancelar esta reserva?");
    if (isConfirmed) {
      handleCancelReservation(id);
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) {
      return "Fecha no seleccionada";
    }
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  };

  return (
    <Card className="w-full my-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Mis Reservas Actuales</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {reservations.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">No tienes reservas activas en este momento.</div>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <Card key={reservation.id} className="p-4 border">
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">{reservation.area}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{formatDate(reservation.date)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{reservation.time}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        reservation.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {reservation.status === "confirmed" ? "Confirmada" : "Pendiente"}
                    </span>

                      <Button
                        variant="outline"                        
                        size="sm"
                        onClick={() => onUpdate(reservation.id)}
                      >
                        Actualizar
                      </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => confirmCancelReservation(reservation.id)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}