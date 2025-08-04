"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, CreditCard, MapPin, Clock, Users } from "lucide-react"
import { getTourBySlug } from "@/services/tour-service"
import type { TouristAttraction } from "@/types/tourist-attraction"
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
import { cn } from "@/lib/utils"
import { format, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CheckoutSteps } from "@/components/checkout-steps"

export default function Checkout() {
  const params = useParams<{ slug: string }>()
  const [step, setStep] = useState(1)
  const [tour, setTour] = useState<TouristAttraction>()
  const [isLoading, setIsLoading] = useState(true)
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

  const [date, setDate] = useState<Date>()
  const [currentStep, setCurrentStep] = useState(1)
  const minimumDate = addDays(new Date(), 5)

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

  const handleInputChange = (field: string, value: string | Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNextStep = () => {
    setStep(prev => prev + 1)
  }

  const handlePrevStep = () => {
    setStep(prev => prev - 1)
  }

  const handleSubmit = async () => {
    // TODO: Implementar integração com Stripe
    console.log('Form data:', formData)
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
      <div className="container mx-auto py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-primary">{tour.name}</h1>
            <div className="text-xl font-semibold text-primary">
              £{tour.price}
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
              Informações
            </div>
            <div className="line"></div>
            <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
              Pagamento
            </div>
          </div>

          <Card className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+44 000 0000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Data do tour</Label>
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
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => handleInputChange('date', date)}
                          locale={ptBR}
                          disabled={(date) =>
                            date < new Date() || date > new Date(2025, 11, 31)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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

                  <div className="space-y-2">
                    <Label htmlFor="hotel">Hotel/Endereço</Label>
                    <Input
                      id="hotel"
                      value={formData.hotel}
                      onChange={(e) => handleInputChange('hotel', e.target.value)}
                      placeholder="Nome do hotel ou endereço"
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
                  <Button onClick={handleNextStep}>
                    Próximo
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número do cartão</Label>
                    <Input
                      id="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardExpiry">Data de expiração</Label>
                      <Input
                        id="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                        placeholder="MM/AA"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardCvc">CVC</Label>
                      <Input
                        id="cardCvc"
                        value={formData.cardCvc}
                        onChange={(e) => handleInputChange('cardCvc', e.target.value)}
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName">Nome no cartão</Label>
                    <Input
                      id="cardName"
                      value={formData.cardName}
                      onChange={(e) => handleInputChange('cardName', e.target.value)}
                      placeholder="Nome como está no cartão"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">CEP/Código postal</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      placeholder="12345-678"
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <Button onClick={handleSubmit}>
                    Finalizar pagamento
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      <style jsx>{`
        .step-item {
          @apply flex items-center justify-center w-36 h-10 bg-gray-100 rounded-full font-medium;
        }
        .step-item.active {
          @apply bg-primary text-white;
        }
        .line {
          @apply flex-1 h-1 bg-gray-200 mx-4;
        }
        .line.active {
          @apply bg-primary;
        }
      `}</style>
    </LayoutWrapper>
  )
}