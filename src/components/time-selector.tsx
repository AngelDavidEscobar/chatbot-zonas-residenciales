"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type TimeSelectorProps = {
  onSelect: (time: string) => void
  area: string
  date?: Date
}

// Mock available times - in a real app, these would come from an API
// based on the selected area and date
const getAvailableTimes = (area: string, date?: Date): string[] => {
  fetch(`/api/comments`,{
    method: "POST",
    body: JSON.stringify({
      area,
      date: date?.toISOString(),
      time: "08:00",
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
    })
  console.log(area, date)
  return [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ]
}

export function TimeSelector({ onSelect, area, date }: TimeSelectorProps) {
  const availableTimes = getAvailableTimes(area, date)

  return (
    <Card className="w-full my-4">
      <CardContent className="p-4">
        <h3 className="font-medium mb-3">Selecciona una hora:</h3>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {availableTimes.map((time) => (
            <Button key={time} variant="outline" onClick={() => onSelect(time)}>
              {time}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

