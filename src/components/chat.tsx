"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Send } from "lucide-react"
import { AreaSelector } from "./area-selector"
import { DateSelector } from "./date-selector"
import { TimeSelector } from "./time-selector"
import { ConfirmationDialog } from "./confirmation-dialog"

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

type ReservationState = {
  area?: string
  date?: Date
  time?: string
  step: "initial" | "area" | "date" | "time" | "confirmation" | "complete"
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "¡Hola! Soy tu asistente para reservar áreas comunes. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [reservation, setReservation] = useState<ReservationState>({
    step: "initial",
  })
  const [showAreaSelector, setShowAreaSelector] = useState(false)
  const [showDateSelector, setShowDateSelector] = useState(false)
  const [showTimeSelector, setShowTimeSelector] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (input.trim() === "") return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInput("")

    // Process user message
    setTimeout(() => {
      processUserMessage(input)
    }, 500)
  }

  const processUserMessage = (message: string) => {
    const lowerMessage = message.toLowerCase()

    if (
      lowerMessage.includes("reservar") ||
      lowerMessage.includes("reserva") ||
      lowerMessage.includes("apartar") ||
      lowerMessage.includes("agendar")
    ) {
      addBotMessage("¡Perfecto! Vamos a hacer una reserva. Primero, ¿qué área común te gustaría reservar?")
      setReservation({ ...reservation, step: "area" })
      setShowAreaSelector(true)
    } else if (
      lowerMessage.includes("hola") ||
      lowerMessage.includes("buenos días") ||
      lowerMessage.includes("buenas tardes")
    ) {
      addBotMessage("¡Hola! Soy tu asistente para reservar áreas comunes. Si deseas hacer una reserva, solo dímelo.")
    } else if (lowerMessage.includes("gracias") || lowerMessage.includes("muchas gracias")) {
      addBotMessage("¡De nada! Estoy aquí para ayudarte con tus reservas de áreas comunes.")
    } else if (lowerMessage.includes("ayuda") || lowerMessage.includes("como funciona")) {
      addBotMessage(
        "Para reservar un área común, solo dime que quieres hacer una reserva. Te guiaré paso a paso para seleccionar el área, la fecha y la hora.",
      )
    } else {
      addBotMessage(
        "No estoy seguro de entender. Si deseas hacer una reserva de un área común, por favor dímelo directamente.",
      )
    }
  }

  const addBotMessage = (content: string) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "bot",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, botMessage])
  }

  const handleAreaSelect = (area: string) => {
    setShowAreaSelector(false)
    setReservation({ ...reservation, area, step: "date" })
    addBotMessage(`Has seleccionado: ${area}. Ahora, ¿en qué fecha te gustaría hacer la reserva?`)
    setShowDateSelector(true)
  }

  const handleDateSelect = (date: Date) => {
    setShowDateSelector(false)
    setReservation({ ...reservation, date, step: "time" })
    addBotMessage(`Has seleccionado la fecha: ${date.toLocaleDateString()}. ¿A qué hora te gustaría hacer la reserva?`)
    setShowTimeSelector(true)
  }

  const handleTimeSelect = (time: string) => {
    setShowTimeSelector(false)
    setReservation({ ...reservation, time, step: "confirmation" })
    addBotMessage(`Has seleccionado la hora: ${time}. Por favor confirma tu reserva.`)
    setShowConfirmation(true)
  }

  const handleConfirmation = (confirmed: boolean) => {
    setShowConfirmation(false)

    if (confirmed) {
      setReservation({ ...reservation, step: "complete" })
      addBotMessage(
        `¡Reserva confirmada! Has reservado ${reservation.area} para el ${reservation.date?.toLocaleDateString()} a las ${reservation.time}. Se ha enviado un correo de confirmación a tu dirección registrada.`,
      )
    } else {
      setReservation({ step: "initial" })
      addBotMessage("Has cancelado la reserva. ¿Puedo ayudarte con algo más?")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  return (
    <div className="flex flex-col w-full h-[600px] border rounded-lg overflow-hidden bg-background">
      <div className="p-4 border-b bg-muted/50">
        <h2 className="text-lg font-semibold">Asistente de Reservas</h2>
        <p className="text-sm text-muted-foreground">Disponible 24/7 para ayudarte</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className="flex items-start gap-2 max-w-[80%]">
                {message.sender === "bot" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://www.svgrepo.com/show/389050/bot.svg" alt="Bot"  />
                    <AvatarFallback>BOT</AvatarFallback>
                  </Avatar>
                )}
                <Card
                  className={`p-3 ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs opacity-70 mt-1 " suppressHydrationWarning>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </Card>
                {message.sender === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://www.svgrepo.com/show/500470/avatar.svg" alt="User" />
                    <AvatarFallback>TÚ</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}

          {showAreaSelector && <AreaSelector onSelect={handleAreaSelect} />}

          {showDateSelector && <DateSelector onSelect={handleDateSelect} />}

          {showTimeSelector && (
            <TimeSelector onSelect={handleTimeSelect} area={reservation.area || ""} date={reservation.date} />
          )}

          {showConfirmation && <ConfirmationDialog reservation={reservation} onConfirm={handleConfirmation} />}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t flex gap-2">
        <Input
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button onClick={handleSend} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

