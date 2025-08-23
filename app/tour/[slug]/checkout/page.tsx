"use client"

import { use, useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, CreditCard, MapPin, Clock, Users, ChevronLeft, ChevronRight, PoundSterling, Shield, CheckCircle } from "lucide-react"
import { getTourBySlug } from "@/services/tour-service"
import { createAppointment } from "@/services/tour-service"
import type { TouristAttraction } from "@/types/tourist-attraction"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"
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
import { format, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { CheckoutSteps } from "@/components/checkout-steps"
import { cn } from "@/lib/utils"

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
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
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
    const loadTour = async () => {
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
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}
    
    if (step === 1) {
      if (!formData.name) newErrors.name = "Nome é obrigatório"
      if (!formData.email) newErrors.email = "Email é obrigatório"
      if (!formData.phone) newErrors.phone = "Telefone é obrigatório"
    }
    
    if (step === 2) {
      if (!formData.date) newErrors.date = "Data é obrigatória"
      if (!formData.hotel) newErrors.hotel = "Hotel/Endereço é obrigatório"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const saveBookingAndRedirectToStripe = async () => {
    if (!tour) {
      throw new Error("Tour não encontrado")
    }

    setIsProcessing(true)

    try {
      // 1. Salvar dados da reserva no banco
      const appointmentData = {
        tour_id: tour.id,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        tour_date: formData.date?.toISOString().split('T')[0] || '',
        passengers: parseInt(formData.passengers),
        luggage: parseInt(formData.luggage),
        hotel: formData.hotel,
        flight_number: formData.flight || null,
        total_price: tour.price,
        status: 'pending'
      }

      const bookingResponse = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      })

      if (!bookingResponse.ok) {
        const errorText = await bookingResponse.text()
        console.error('Erro ao salvar reserva:', errorText)
        throw new Error('Erro ao salvar reserva')
      }

      const bookingResult = await bookingResponse.json()
      console.log('Reserva salva com sucesso:', bookingResult)

      // 2. Criar sessão de checkout do Stripe
      const checkoutResponse = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tourId: tour.id,
          tourName: tour.name,
          price: tour.price,
          customerData: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            date: formData.date?.toISOString().split('T')[0],
            passengers: formData.passengers,
            hotel: formData.hotel,
            flight: formData.flight,
          },
        }),
      })

      if (!checkoutResponse.ok) {
        const errorText = await checkoutResponse.text()
        console.error('Erro ao criar sessão de pagamento:', errorText)
        throw new Error('Erro ao criar sessão de pagamento')
      }

      const { sessionUrl, error } = await checkoutResponse.json()

      if (error || !sessionUrl) {
        throw new Error(error || "Erro ao criar sessão de pagamento")
      }

      // 3. Redirecionar para o Stripe
      window.location.href = sessionUrl

    } catch (error) {
      console.error('Erro ao processar pagamento:', error)
      toast({
        title: "Erro",
        description: "Erro ao processar reserva. Tente novamente.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  const handleNextStep = () => {
    if (!validateStep(currentStep)) {
      return
    }

    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1))
  }

  const generatePassengerOptions = () => {
    return Array.from({ length: 8 }, (_, i) => (
      <SelectItem key={i + 1} value={(i + 1).toString()}>
        {i + 1} {i === 0 ? 'passageiro' : 'passageiros'}
      </SelectItem>
    ))
  }

  const generateLuggageOptions = () => {
    return Array.from({ length: 9 }, (_, i) => (
      <SelectItem key={i} value={i.toString()}>
        {i} {i === 1 ? 'mala' : 'malas'}
      </SelectItem>
    ))
  }

  if (isLoading) {
    return (
      <LayoutWrapper>
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Carregando...</p>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    )
  }

  if (!tour) {
    return (
      <LayoutWrapper>
        <div className="container mx-auto py-8 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Tour não encontrado</h1>
            <p>O tour solicitado não foi encontrado.</p>
          </div>
        </div>
      </LayoutWrapper>
    )
  }

  const totalPrice = tour.price

  return (
    <LayoutWrapper>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">{tour.name}</h1>
            <CheckoutSteps step={currentStep} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-6">
                {/* ETAPA 1: Dados do Cliente */}
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
                          className={errors.name ? "border-red-500" : ""}
                          required
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="seu@email.com"
                          className={errors.email ? "border-red-500" : ""}
                          required
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+44 000 0000"
                          className={errors.phone ? "border-red-500" : ""}
                          required
                        />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
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

                {/* ETAPA 2: Dados da Viagem */}
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
                                !formData.date && "text-muted-foreground",
                                errors.date && "border-red-500"
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
                        {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label>Hotel/Endereço *</Label>
                        <Input
                          id="hotel"
                          value={formData.hotel}
                          onChange={(e) => handleInputChange('hotel', e.target.value)}
                          placeholder="Nome do hotel ou endereço"
                          className={errors.hotel ? "border-red-500" : ""}
                          required
                        />
                        {errors.hotel && <p className="text-red-500 text-sm">{errors.hotel}</p>}
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
                        Continuar para confirmação
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* ETAPA 3: Confirmação e Redirecionamento para Stripe */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-2">Confirmação da Reserva</h2>
                      <p className="text-gray-600">Revise seus dados antes de prosseguir para o pagamento</p>
                    </div>

                    {/* Resumo dos dados coletados */}
                    <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                      <h3 className="font-semibold text-lg mb-4">Resumo da sua reserva:</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Nome:</p>
                          <p className="font-medium">{formData.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">E-mail:</p>
                          <p className="font-medium">{formData.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Telefone:</p>
                          <p className="font-medium">{formData.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Data do tour:</p>
                          <p className="font-medium">
                            {formData.date ? format(formData.date, "PPP", { locale: ptBR }) : 'Não selecionada'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hotel/Endereço:</p>
                          <p className="font-medium">{formData.hotel}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Passageiros:</p>
                          <p className="font-medium">{formData.passengers}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Malas:</p>
                          <p className="font-medium">{formData.luggage}</p>
                        </div>
                        {formData.flight && (
                          <div>
                            <p className="text-sm text-gray-600">Voo:</p>
                            <p className="font-medium">{formData.flight}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Aviso sobre redirecionamento */}
                    <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-2">Próximo passo: Pagamento Seguro</h4>
                          <p className="text-blue-800 text-sm mb-4">
                            Ao clicar em "Prosseguir para Pagamento", seus dados serão salvos em nosso sistema 
                            e você será redirecionado para a plataforma segura do Stripe para finalizar o pagamento.
                          </p>
                          <div className="flex items-center space-x-2 text-sm text-blue-700">
                            <CheckCircle className="w-4 h-4" />
                            <span>Pagamento 100% seguro com Stripe</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-blue-700 mt-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>Seus dados estão protegidos</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-blue-700 mt-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>Confirmação imediata por e-mail</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-6">
                      <Button variant="outline" onClick={handlePrevStep} disabled={isProcessing}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Voltar
                      </Button>
                      <Button 
                        onClick={saveBookingAndRedirectToStripe} 
                        size="lg" 
                        disabled={isProcessing}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processando...
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Prosseguir para Pagamento
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Sidebar com resumo */}
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
                      <span>Preço fixo (até 8 passageiros):</span>
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