
"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check } from "lucide-react"
import { getTourBySlug } from "@/services/tour-service"
import type { TouristAttraction } from "@/types/tourist-attraction"
import { StripeProvider } from "@/components/stripe-provider"
import { StripePaymentForm } from "@/components/stripe-payment-form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Checkout() {
  const params = useParams<{ slug: string }>()
  const [step, setStep] = useState(1)
  const [tour, setTour] = useState<TouristAttraction>()
  const [isLoading, setIsLoading] = useState(true)
  const [clientSecret, setClientSecret] = useState('')
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: undefined as Date | undefined,
    passengers: "1",
    luggage: "0",
    hotel: "",
    flight: "",
    postalCode: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    cardName: "",
  })

  useEffect(() => {
    async function loadTour() {
      try {
        const tourData = await getTourBySlug(params.slug)
        if (tourData) {
          setTour(tourData)
        }
      } catch (error) {
        console.error('Erro ao carregar tour:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadTour()
  }, [params.slug])

  useEffect(() => {
    if (step === 2 && tour) {
      createPaymentIntent()
    }
  }, [step, tour])

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: tour!.price * 100, // Converter para centavos
          currency: 'gbp',
          metadata: {
            tourId: tour!.id,
            tourName: tour!.name,
            customerName: formData.name,
            customerEmail: formData.email,
          },
        }),
      })
      
      const { clientSecret } = await response.json()
      setClientSecret(clientSecret)
    } catch (error) {
      console.error('Erro ao criar intent de pagamento:', error)
    }
  }

  const handleInputChange = (field: string, value: string | Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateStep1 = () => {
    return formData.name && formData.email && formData.phone && formData.date && formData.hotel
  }

  const handleNextStep = () => {
    if (step === 1 && !validateStep1()) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }
    setStep(prev => prev + 1)
  }

  const handlePrevStep = () => {
    setStep(prev => prev - 1)
  }

  const handlePaymentSuccess = () => {
    window.location.href = `/tour/${params.slug}/success`
  }

  const handlePaymentError = (error: string) => {
    console.error('Erro no pagamento:', error)
    alert('Erro no pagamento: ' + error)
  }

  const generatePassengerOptions = () => {
    const options = []
    for (let i = 1; i <= 8; i++) {
      options.push(
        <SelectItem key={i} value={i.toString()}>
          {i} {i === 1 ? 'passageiro' : 'passageiros'}
        </SelectItem>
      )
    }
    return options
  }

  const generateLuggageOptions = () => {
    const options = []
    for (let i = 0; i <= 16; i++) {
      options.push(
        <SelectItem key={i} value={i.toString()}>
          {i} {i === 1 ? 'mala' : 'malas'}
        </SelectItem>
      )
    }
    return options
  }

  if (isLoading || !tour) {
    return (
      <LayoutWrapper>
        <div className="container mx-auto py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-primary">{tour.name}</h1>
            <div className="text-xl font-semibold text-primary">
              £{tour.price}
            </div>
          </div>

          {/* Progress Steps - Melhorado */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step >= 1 ? 'bg-primary border-primary text-white' : 'border-gray-300'
                }`}>
                  {step > 1 ? <Check className="w-4 h-4" /> : '1'}
                </div>
                <span className="font-medium">Informações</span>
              </div>
              
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
              
              <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step >= 2 ? 'bg-primary border-primary text-white' : 'border-gray-300'
                }`}>
                  {step > 2 ? <Check className="w-4 h-4" /> : '2'}
                </div>
                <span className="font-medium">Pagamento</span>
              </div>
            </div>
          </div>

          <Card className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Informações da Reserva</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+44 000 0000"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Data do tour *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.date ? (
                            format(formData.date, "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => handleInputChange('date', date)}
                          locale={ptBR}
                          disabled={(date) => {
                            const today = new Date()
                            const minDate = new Date(today)
                            minDate.setDate(today.getDate() + 5)
                            return date < minDate || date > new Date(2025, 11, 31)
                          }}
                          initialFocus
                          className="bg-white"
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-gray-500">Mínimo de 5 dias de antecedência</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Número de passageiros</Label>
                    <Select
                      value={formData.passengers}
                      onValueChange={(value) => handleInputChange('passengers', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {generatePassengerOptions()}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Número de malas</Label>
                    <Select
                      value={formData.luggage}
                      onValueChange={(value) => handleInputChange('luggage', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {generateLuggageOptions()}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="hotel">Hotel/Endereço *</Label>
                    <Input
                      id="hotel"
                      value={formData.hotel}
                      onChange={(e) => handleInputChange('hotel', e.target.value)}
                      placeholder="Nome do hotel ou endereço completo"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="flight">Número do voo (opcional)</Label>
                    <Input
                      id="flight"
                      value={formData.flight}
                      onChange={(e) => handleInputChange('flight', e.target.value)}
                      placeholder="Ex: BA1234"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleNextStep} disabled={!validateStep1()}>
                    Próximo
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Pagamento Seguro</h2>
                
                {clientSecret ? (
                  <StripeProvider clientSecret={clientSecret}>
                    <StripePaymentForm
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      total={tour.price}
                    />
                  </StripeProvider>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2">Carregando formulário de pagamento...</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </LayoutWrapper>
  )
}
