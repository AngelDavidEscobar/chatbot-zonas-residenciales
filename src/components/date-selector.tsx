"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

type DateSelectorProps = {
  onSelect: (date: Date) => void
}

export function DateSelector({ onSelect }: DateSelectorProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const handleSelect = () => {
    if (date) {
      onSelect(date)
    }
  }

  return (
    <Card className="w-full my-4">
      <CardContent className="p-4">
        <h3 className="font-medium mb-3">Selecciona una fecha:</h3>
        <div className="flex flex-col items-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border mb-4"
            disabled={(date) => {
              // Disable dates in the past
              return date < new Date(new Date().setHours(0, 0, 0, 0))
            }}
          />
          <Button onClick={handleSelect} disabled={!date}>
            Confirmar fecha
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

