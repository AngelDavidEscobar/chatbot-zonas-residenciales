"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PocketIcon as Pool, Dumbbell, Users, Utensils, Gamepad2 } from "lucide-react"

type AreaSelectorProps = {
  onSelect: (area: string) => void
}

const areas = [
  { id: "pool", name: "Piscina", icon: Pool },
  { id: "gym", name: "Gimnasio", icon: Dumbbell },
  { id: "social", name: "Salón Social", icon: Users },
  { id: "bbq", name: "Zona de BBQ", icon: Utensils },
  { id: "games", name: "Sala de Juegos", icon: Gamepad2 },
]

export function AreaSelector({ onSelect }: AreaSelectorProps) {
  return (
    <Card className="w-full my-4">
      <CardContent className="p-4">
        <h3 className="font-medium mb-3">Selecciona un área común:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {areas.map((area) => {
            const Icon = area.icon
            return (
              <Button
                key={area.id}
                variant="outline"
                className="flex flex-col h-24 gap-2 p-2"
                onClick={() => onSelect(area.name)}
              >
                <Icon className="h-6 w-6" />
                <span>{area.name}</span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

