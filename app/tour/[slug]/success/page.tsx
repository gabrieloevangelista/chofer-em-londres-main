"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Calendar } from "lucide-react"

export default function Success() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [bookingDetails, setBookingDetails] = useState<{
    metadata: {
      tourName: string
      tourDate: string
      passengers: string
      hotel: string
      flight?: string
    }
  } | null>(null)

  useEffect(() => {
    async function loadBookingDetails() {
      if (sessionId) {
        try {
          const response = await fetch(`/api/stripe/get-session?session_id=${sessionId}`)
          const data = await response.json()
          setBookingDetails(data)
        } catch (error) {
          console.error("Erro ao carregar detalhes da reserva:", error)
        }
      }
    }
    loadBookingDetails()
  }, [sessionId])

  const handleAddToCalendar = () => {
    if (bookingDetails) {
      const tourDate = new Date(bookingDetails.metadata.tourDate)
      const endDate = new Date(tourDate.getTime() + (4 * 60 * 60 * 1000)) // Assuming 4 hours duration

      const event = {
        text: bookingDetails.metadata.tourName,
        details: `Tour em Londres
Passageiros: ${bookingDetails.metadata.passengers}
Hotel: ${bookingDetails.metadata.hotel}
${bookingDetails.metadata.flight ? `Voo: ${bookingDetails.metadata.flight}` : ""}`,
        location: "Londres",
        startTime: tourDate.toISOString(),
        endTime: endDate.toISOString(),
      }

      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.text)}&details=${encodeURIComponent(event.details)}&location=${encodeURIComponent(event.location)}&dates=${event.startTime.replace(/[-:]/g, "").replace(/\.\d{3}/, "")}/${event.endTime.replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`

      window.open(googleCalendarUrl, "_blank")
    }
  }

  return (
    <LayoutWrapper>
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto p-8">
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h1 className="text-3xl font-bold">Reserva Confirmada!</h1>
            <p className="text-gray-600">
              Obrigado por reservar seu tour conosco. Você receberá um email com os detalhes da sua reserva.
            </p>
            
            {bookingDetails && (
              <div className="mt-8 space-y-4 text-left">
                <h2 className="text-xl font-semibold">Detalhes da Reserva:</h2>
                <div className="space-y-2">
                  <p><strong>Tour:</strong> {bookingDetails.metadata.tourName}</p>
                  <p><strong>Data:</strong> {new Date(bookingDetails.metadata.tourDate).toLocaleDateString()}</p>
                  <p><strong>Passageiros:</strong> {bookingDetails.metadata.passengers}</p>
                  <p><strong>Hotel:</strong> {bookingDetails.metadata.hotel}</p>
                  {bookingDetails.metadata.flight && (
                    <p><strong>Voo:</strong> {bookingDetails.metadata.flight}</p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-8">
              <Button 
                className="gap-2" 
                onClick={handleAddToCalendar}
              >
                <Calendar className="w-5 h-5" />
                Adicionar ao Google Calendar
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </LayoutWrapper>
  )
}
