"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin } from "lucide-react"

type ConfirmationDialogProps = {
  reservation: {
    area?: string
    date?: Date
    time?: string
  }
  onConfirm: (confirmed: boolean) => void
}

export function ConfirmationDialog({ reservation, onConfirm }: ConfirmationDialogProps) {
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

      <CardFooter className="flex justify-between gap-2 p-4">
        <Button variant="outline" className="w-full" onClick={() => onConfirm(false)}>
          Cancelar
        </Button>
        <Button className="w-full" onClick={() => onConfirm(true)}>
          Confirmar Reserva
        </Button>
      </CardFooter>
    </Card>
  )
}

