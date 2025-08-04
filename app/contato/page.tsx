"use client"

import { useState, useEffect, type FormEvent } from "react"
import { useSearchParams } from "next/navigation"
import { LayoutWrapper } from "../../components/layout-wrapper"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { attractions } from "../../data/attractions"
import { MessageCircle, Mail, Phone, MapPin } from "lucide-react"

export default function Contato() {
  const searchParams = useSearchParams()
  const tourId = searchParams.get("tour")
  const [selectedTour, setSelectedTour] = useState("")

  // Adicione estados para os campos do formulário
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (tourId) {
      const tour = attractions.find((a) => a.id === tourId)
      if (tour) {
        setSelectedTour(tour.name)
      }
    }
  }, [tourId])

  // Função para enviar mensagem para o WhatsApp
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const phoneNumber = "+447753144044"
    let messageText = `Olá! Meu nome é ${name}.\n\n`

    if (selectedTour) {
      messageText += `Estou interessado(a) no tour: ${selectedTour}\n\n`
    }

    messageText += `${message}\n\n`
    messageText += `Meus contatos:\nEmail: ${email}\nWhatsApp: ${whatsapp}`

    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, "")}?text=${encodeURIComponent(messageText)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <LayoutWrapper>
      <div className="container-custom mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-12 text-center">Entre em Contato</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp
                </label>
                <Input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  required
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              {selectedTour && (
                <div>
                  <label htmlFor="tour" className="block text-sm font-medium text-gray-700 mb-1">
                    Tour Selecionado
                  </label>
                  <Input
                    type="text"
                    id="tour"
                    name="tour"
                    value={selectedTour}
                    readOnly
                    className="w-full bg-gray-50 rounded-lg border-gray-200"
                  />
                </div>
              )}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full h-32 rounded-lg border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition-colors shadow-md"
              >
                <MessageCircle className="mr-2 h-5 w-5" /> Enviar Mensagem via WhatsApp
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Informações de Contato</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-4 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Telefone</h3>
                    <a href="tel:+442012345678" className="text-primary hover:underline">
                      +44 20 1234 5678
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-4 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">E-mail</h3>
                    <a href="mailto:info@choferemlondres.com" className="text-primary hover:underline">
                      info@choferemlondres.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-4 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Endereço</h3>
                    <a
                      href="https://maps.google.com/?q=94+Burrows+Rd,+London+NW10+5SH,+Reino+Unido"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      94 Burrows Rd, London NW10 5SH, Reino Unido
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Horário de Atendimento</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Segunda - Sexta:</span>
                  <span className="text-gray-900 font-medium">9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sábado:</span>
                  <span className="text-gray-900 font-medium">10:00 - 16:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Domingo:</span>
                  <span className="text-gray-900 font-medium">Fechado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
