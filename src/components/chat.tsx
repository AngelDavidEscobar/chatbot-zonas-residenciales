"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
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
import { cedulaSchema, telefonoSchema } from "@/lib/schemaValidations"
import { z } from "zod"
import { ReservationsList } from "./reservations_list"


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
  step: "initial" | "area" | "date" | "time" | "confirmation" | "complete" | "reservations"
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
  const [reservation, setReservation] = useState<ReservationState>({ step: "initial" })
  const [authState, setAuthState] = useState<'cedula' | 'celular' | 'authenticated'>("cedula")
  const [userData, setUserData] = useState<{ cedula?: string; celular?: string }>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string >('')

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const addBotMessage = useCallback((content: string) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "bot",
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, botMessage])
  }, [])

  useEffect(() => {
    addBotMessage("Por favor, ingresa tu número de cédula.")
  }, [addBotMessage])

  const handleSend = () => {
    if (input.trim() === "" || isProcessing) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, newMessage])
    setInput("")
    setIsProcessing(true)

    setTimeout(() => {
      processUserMessage(input)
      setIsProcessing(false)
    }, 500)
  }

  const validateAuthInput = (type: 'cedula' | 'celular', value: string): { isValid: boolean; error?: string } => {
    try {
      const schema = type === 'cedula' ? cedulaSchema : telefonoSchema
      schema.parse(value)
      return { isValid: true }
    } catch (e) {
      if (e instanceof z.ZodError) {
        const errorMsg = e.issues[0].message
        setErrorMessage(errorMsg) 
        return { isValid: false, error: errorMsg }
      }
      return { isValid: false, error: "Error desconocido" }
    }
  }

  const processUserMessage = useCallback((message: string) => {
    const lowerMessage = message.toLowerCase()
    console.log('error',errorMessage)
    // Proceso de autenticación
    if (authState === "cedula") {
      const validation = validateAuthInput('cedula', message)
      if (!validation.isValid) {
        addBotMessage(validation.error || "Error de validación")
        return
      }
      setUserData(prev => ({ ...prev, cedula: message }))
      setAuthState("celular")
      addBotMessage("Por favor, ingresa tu número de teléfono.")
      return
    }

    if (authState === "celular") {
      const validation = validateAuthInput('celular', message)
      if (!validation.isValid) {
        addBotMessage(validation.error || "Error de validación")
        return
      }
      setUserData(prev => ({ ...prev, celular: message }))
      setAuthState("authenticated")
      addBotMessage("¡Autenticación exitosa! ¿Qué deseas hacer?\n\n1️⃣ Reservar un área común\n2️⃣ Ver y cancelar mis reservas\n3️⃣ Disponibilidad\n4️⃣ Información")
      return
    }

    // Proceso normal después de autenticación
    if (reservation.step === "area") {
      handleAreaSelect(message)
      return
    }

    if (reservation.step === "date") {
      // Lógica para manejar fecha por texto
      return
    }

    if (reservation.step === "time") {
      // Lógica para manejar hora por texto
      return
    }

    // Comandos generales
    if (/^1|reservar/i.test(lowerMessage)) {
      addBotMessage("Selecciona el área que deseas reservar:")
      setReservation({ step: "area" })
    } else if (/^2|ver reservas/i.test(lowerMessage)) {
      addBotMessage("Reservas actuales:")
      setReservation({ step: "reservations" })
    } else if (/^3|disponibilidad/i.test(lowerMessage)) {
      addBotMessage("Consulta de disponibilidad. Selecciona un área:")
      setReservation({ step: "area" })
    } else if (/^4|información/i.test(lowerMessage)) {
      addBotMessage(
        "Áreas disponibles:\n\n• Piscina (8:00-20:00)\n• Gimnasio (24hrs)\n• Salón Social (8:00-22:00)\n• Zona BBQ (10:00-20:00)\n• Sala de Juegos (9:00-21:00)"
      )
    } else {
      addBotMessage(
        "Selecciona una opción:\n1️⃣ Reservar\n2️⃣ Ver y cancelar mis reservas\n3️⃣ Disponibilidad\n4️⃣ Información"
      )
    }
  }, [addBotMessage, authState, reservation.step])

  const handleAreaSelect = useCallback((area: string) => {
    setReservation(prev => ({ ...prev, area, step: "date" }))
    addBotMessage(`Área seleccionada: ${area}. Ingresa la fecha (DD/MM/AAAA):`)
  }, [addBotMessage])

  const handleDateSelect = useCallback((date: Date) => {
    setReservation(prev => ({ ...prev, date, step: "time" }))
    addBotMessage(`Fecha seleccionada: ${date.toLocaleDateString()}. Ingresa la hora (HH:MM):`)
  }, [addBotMessage])

  const handleCloseReservations = useCallback(() => {
    setReservation(prev => ({ ...prev, step: "initial" }))
    addBotMessage(
      "Selecciona una opción:\n1️⃣ Reservar\n2️⃣ Ver y cancelar mis reservas\n3️⃣ Disponibilidad\n4️⃣ Información"
    )
  },[addBotMessage])

  //esto esta pendiente por hacer
  const handleCancelReservation = useCallback((id: string) => {
    console.log(id);
    setReservation(prev => ({ ...prev, step: "reservations" }))
    addBotMessage(`Cancelando reserva: ${id}`)
  },[addBotMessage])


  const handleTimeSelect = useCallback((time: string) => {
    setReservation(prev => ({ ...prev, time, step: "confirmation" }))
    addBotMessage(`Hora seleccionada: ${time}. Confirma tu reserva:`)
  }, [addBotMessage])

  const handleConfirmation = useCallback((confirmed: boolean) => {
    if (confirmed) {
      addBotMessage(
        `✅ Reserva confirmada!\nÁrea: ${reservation.area}\nFecha: ${reservation.date?.toLocaleDateString()}\nHora: ${reservation.time}\nCédula: ${userData.cedula}\nCelular: ${userData.celular}`
      )
    } else {
      addBotMessage("Reserva cancelada. ¿Necesitas algo más?")
    }
    setReservation({ step: "initial" })
  }, [addBotMessage, reservation.area, reservation.date, reservation.time])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col w-full h-[600px] border rounded-lg overflow-hidden bg-background">
      <div className="p-4 border-b bg-muted/50">
        <h2 className="text-lg font-semibold">Asistente de Reservas</h2>
        <p className="text-sm text-muted-foreground">Conjunto Residencial Las Palmas</p>
      </div>

      <ScrollArea className="flex-1 p-4 overflow-y-auto">
  <div className="space-y-4">
    {messages.map((message) => (
      <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
        <div className="flex items-start gap-2 max-w-[80%]">
          {message.sender === "bot" && (
            <Avatar className="h-8 w-8">
              <AvatarImage src="/assets/icons/bot-icon.svg" alt="Asistente" />
              <AvatarFallback>BOT</AvatarFallback>
            </Avatar>
          )}
          <Card className={`p-3 ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
            <div className="whitespace-pre-line">{message.content}</div>
            <time className="text-xs opacity-70 mt-1 block">
              {message.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </time>
          </Card>
          {message.sender === "user" && (
            <Avatar className="h-8 w-8">
              <AvatarImage src="/assets/icons/avatar-default-icon.svg" alt="Usuario" />
              <AvatarFallback>TÚ</AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    ))}

    {reservation.step === "area" && <AreaSelector onSelect={handleAreaSelect} />}
    {reservation.step === "date" && <DateSelector onSelect={handleDateSelect} />}
    {reservation.step === "time" && (
      <TimeSelector
        onSelect={handleTimeSelect}
        area={reservation.area || ""}
        date={reservation.date}
      />
    )}
    {reservation.step === "confirmation" && (
      <ConfirmationDialog
        reservation={reservation}
        onConfirm={handleConfirmation}
        cedula={userData.cedula || ''}
        celular={userData.celular || ''}
      />
    )}
    {reservation.step === "reservations" && 
    <ReservationsList 
    onClose={handleCloseReservations} 
    onCancel={handleCancelReservation} 
    cedula={userData.cedula || ''} />}

    {isProcessing && (
      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="animate-pulse">Escribiendo...</div>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    )}

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
          disabled={isProcessing}
          aria-label="Mensaje"
        />
        <Button
          onClick={handleSend}
          size="icon"
          disabled={!input.trim() || isProcessing}
          aria-label="Enviar mensaje"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}