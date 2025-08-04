
"use client"

import { use, useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, CreditCard, MapPin, Clock, Users, ChevronLeft, ChevronRight, PoundSterling } from "lucide-react"
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
import { Calendar } from "@/components/ui/calendar"
import { CheckoutSteps } from "@/components/checkout-steps"
import { StripeProvider } from "@/components/stripe-provider"
import { StripePaymentForm } from "@/components/stripe-payment-form"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default function CheckoutPage({ params }: PageProps) {
  const { slug } = use(params)
  const [tour, setTour] = useState<TouristAttraction | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [clientSecret, setClientSecret] = useState("")
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: undefined as Date | undefined,
    passengers: "1",
    luggage: "0",
    hotel: "",
    flight: "",
  })

  const minimumDate = addDays(new Date(), 5)

  useEffect(() => {
    async function loadTour() {
      try {
        const tourData = await getTourBySlug(slug)
        if (tourData) {
          setTour(tourData)
        } else {
          notFound()
        }
      } catch (error) {
        console.error('Erro ao carregar tour:', error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }
    loadTour()
  }, [slug])

  const handleInputChange = (field: string, value: string | Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const saveBookingData = async () => {
    try {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tourId: tour!.id,
          tourName: tour!.name,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          tourDate: formData.date!.toISOString(),
          passengers: parseInt(formData.passengers),
          luggage: parseInt(formData.luggage),
          hotel: formData.hotel,
          flight: formData.flight,
          totalPrice: tour!.price * parseInt(formData.passengers),
          status: 'pending'
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar dados da reserva')
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao salvar dados:', error)
      throw error
    }
  }

  const handleNextStep = async () => {
    if (currentStep === 1) {
      // Validar dados do cliente
      if (!formData.name || !formData.email || !formData.phone) {
        alert("Por favor, preencha todos os campos obrigatórios do cliente")
        return
      }
      setCurrentStep(2)
    } else if (currentStep === 2) {
      // Validar dados da viagem
      if (!formData.date || !formData.hotel) {
        alert("Por favor, preencha todos os campos obrigatórios da viagem")
        return
      }

      // Validar data mínima de 5 dias
      const today = new Date()
      const selectedDate = new Date(formData.date)
      const diffTime = selectedDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays < 5) {
        alert("A data do tour deve ser pelo menos 5 dias a partir de hoje")
        return
      }

      try {
        // Salvar dados da reserva no banco
        await saveBookingData()

        // Criar Payment Intent
        const response = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: tour!.price * parseInt(formData.passengers) * 100, // Converter para centavos
            currency: 'gbp',
            metadata: {
              tourId: tour!.id,
              tourName: tour!.name,
              tourDate: formData.date!.toISOString(),
              passengers: formData.passengers,
              luggage: formData.luggage,
              hotel: formData.hotel,
              flight: formData.flight,
              customerName: formData.name,
              customerEmail: formData.email,
              customerPhone: formData.phone,
            }
          }),
        })

        if (!response.ok) {
          throw new Error('Erro ao criar payment intent')
        }

        const { client_secret } = await response.json()
        setClientSecret(client_secret)
        setCurrentStep(3)
      } catch (error) {
        console.error('Erro ao processar:', error)
        alert('Erro ao processar reserva. Tente novamente.')
      }
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handlePaymentSuccess = () => {
    window.location.href = `/tour/${slug}/success?session_id=success`
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

  const totalPrice = tour.price * parseInt(formData.passengers)

  return (
    <LayoutWrapper>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">{tour.name}</h1>
            <CheckoutSteps step={currentStep} />
          </div>

          {/* Layout de 2 colunas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna principal - Formulário */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-2">Dados do Cliente</h2>
                      <p className="text-gray-600">Preencha suas informações pessoais</p>
                    </div>

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

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+44 000 0000"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-6">
                      <Button onClick={handleNextStep} size="lg">
                        Continuar para dados da viagem
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-2">Dados da Viagem</h2>
                      <p className="text-gray-600">Escolha data, passageiros e bagagem</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Data do tour *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal bg-white",
                                !formData.date && "text-muted-foreground"
                              )}
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
                              disabled={(date) =>
                                date < minimumDate || date > new Date(2026, 11, 31)
                              }
                              initialFocus
                              className="bg-white"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label>Hotel/Endereço *</Label>
                        <Input
                          id="hotel"
                          value={formData.hotel}
                          onChange={(e) => handleInputChange('hotel', e.target.value)}
                          placeholder="Nome do hotel ou endereço"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Número de passageiros (máx. 8)</Label>
                        <Select
                          value={formData.passengers}
                          onValueChange={(value) => handleInputChange('passengers', value)}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
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
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {generateLuggageOptions()}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="flight">Número do voo (opcional)</Label>
                        <Input
                          id="flight"
                          value={formData.flight}
                          onChange={(e) => handleInputChange('flight', e.target.value)}
                          placeholder="Ex: BA1234"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between pt-6">
                      <Button variant="outline" onClick={handlePrevStep}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Voltar
                      </Button>
                      <Button onClick={handleNextStep} size="lg">
                        Continuar para pagamento
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-2">Pagamento</h2>
                      <p className="text-gray-600">Complete seu pagamento de forma segura</p>
                    </div>

                    <StripeProvider clientSecret={clientSecret}>
                      <StripePaymentForm
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        total={totalPrice}
                      />
                    </StripeProvider>

                    <div className="flex justify-between pt-6">
                      <Button variant="outline" onClick={handlePrevStep}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Voltar
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Coluna lateral - Resumo da compra */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-lg">Resumo da reserva</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-primary">{tour.name}</h3>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{tour.duration}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{tour.category}</span>
                    </div>

                    {formData.date && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{format(formData.date, "PPP", { locale: ptBR })}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{formData.passengers} {parseInt(formData.passengers) === 1 ? 'passageiro' : 'passageiros'}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Preço por pessoa:</span>
                      <span>£{tour.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Passageiros:</span>
                      <span>{formData.passengers}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span className="flex items-center gap-1">
                        <PoundSterling className="w-4 h-4" />
                        {totalPrice}
                      </span>
                    </div>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg text-sm text-green-700">
                    ✓ Confirmação imediata por email
                    <br />
                    ✓ Cancelamento grátis até 24h antes
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
