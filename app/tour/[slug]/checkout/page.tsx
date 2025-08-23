"use client"

<<<<<<< HEAD
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
=======
import { use, useState, useEffect } from "react"
import { notFound } from "next/navigation"
>>>>>>> 836f31ad909de4cd60c3918b6ed9eefa617e8d5c
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
<<<<<<< HEAD
import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2, Check } from "lucide-react"
=======
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, CreditCard, MapPin, Clock, Users, ChevronLeft, ChevronRight, PoundSterling } from "lucide-react"
>>>>>>> 836f31ad909de4cd60c3918b6ed9eefa617e8d5c
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
<<<<<<< HEAD
import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperContent,
  StepperConnector,
  StepperLabel,
} from "@/components/ui/stepper"

export default function Checkout() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [tour, setTour] = useState<TouristAttraction>()
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
=======
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

>>>>>>> 836f31ad909de4cd60c3918b6ed9eefa617e8d5c
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: undefined as Date | undefined,
    passengers: "1",
    luggage: "0",
    hotel: "",
    flight: "",
<<<<<<< HEAD
    postalCode: "",
=======
>>>>>>> 836f31ad909de4cd60c3918b6ed9eefa617e8d5c
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
    // Limpar erro quando o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

<<<<<<< HEAD
  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {}
    
    if (currentStep === 1) {
      if (!formData.name) newErrors.name = "Nome é obrigatório"
      if (!formData.email) newErrors.email = "Email é obrigatório"
      if (!formData.phone) newErrors.phone = "Telefone é obrigatório"
      if (!formData.date) newErrors.date = "Data é obrigatória"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1)
=======
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
          totalPrice: tour!.price, // Preço fixo para até 8 passageiros
          status: 'pending'
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Erro ao salvar reserva:', errorText)
        alert('Erro ao processar reserva. Tente novamente.')
        return
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
        const paymentResponse = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: tour!.price * 100, // Preço fixo em centavos
            currency: 'gbp',
            email: formData.email,
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

        if (!paymentResponse.ok) {
          const errorText = await paymentResponse.text()
          console.error('Erro ao criar payment intent:', errorText)
          alert('Erro ao inicializar pagamento. Tente novamente.')
          return
        }

        const { client_secret } = await paymentResponse.json()
        setClientSecret(client_secret)
        setCurrentStep(3)
      } catch (error) {
        console.error('Erro ao processar:', error)
        alert('Erro ao processar reserva. Tente novamente.')
      }
>>>>>>> 836f31ad909de4cd60c3918b6ed9eefa617e8d5c
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1)
  }

<<<<<<< HEAD
  const handleSubmit = async () => {
    if (!validateStep(step)) return
    
    if (!tour) {
      toast({
        title: "Erro",
        description: "Informações do tour não encontradas",
        variant: "destructive"
      })
      return
    }
    
    setIsProcessing(true)
    
    try {
      // 1. Salvar os dados no banco
      const appointmentDate = formData.date ? format(formData.date, 'yyyy-MM-dd') : ''
      const appointmentTime = '12:00:00' // Horário padrão ou pode ser adicionado ao formulário
      
      const appointmentResult = await createAppointment({
        tour_id: tour.id,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        passengers: parseInt(formData.passengers),
        special_requests: `Malas: ${formData.luggage}, Hotel: ${formData.hotel}, Voo: ${formData.flight || 'Não informado'}`
      })
      
      if (!appointmentResult.success) {
        throw new Error("Erro ao salvar dados da reserva")
      }
      
      // 2. Criar sessão de checkout no Stripe
      const response = await fetch('/api/stripe/create-checkout-session', {
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
            date: formData.date,
            passengers: formData.passengers,
            luggage: formData.luggage,
            hotel: formData.hotel,
            flight: formData.flight,
          }
        }),
      })
      
      const { sessionUrl, error } = await response.json()
      
      if (error || !sessionUrl) {
        throw new Error(error || "Erro ao criar sessão de pagamento")
      }
      
      // 3. Redirecionar para o Stripe
      window.location.href = sessionUrl
      
    } catch (error) {
      console.error('Erro ao processar pagamento:', error)
      toast({
        title: "Erro no processamento",
        description: "Ocorreu um erro ao processar sua reserva. Por favor, tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
=======
  const handlePaymentSuccess = () => {
    window.location.href = `/tour/${slug}/success?session_id=success`
  }

  const handlePaymentError = (error: string) => {
    console.error('Erro no pagamento:', error)
    alert('Erro no pagamento: ' + error)
>>>>>>> 836f31ad909de4cd60c3918b6ed9eefa617e8d5c
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
    for (let i = 0; i <= 8; i++) {
      options.push(
        <SelectItem key={i} value={i.toString()}>
          {i} {i === 1 ? 'mala' : 'malas'}
        </SelectItem>
      )
    }
    return options
  }

  if (isLoading) {
    return (
      <LayoutWrapper>
        <div className="container-custom mx-auto py-12">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </LayoutWrapper>
    )
  }

  if (!tour) {
    return (
      <LayoutWrapper>
        <div className="container-custom mx-auto py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Tour não encontrado</h1>
            <p className="mb-6">Não foi possível encontrar o tour solicitado.</p>
            <Button onClick={() => router.push('/tours')}>Ver todos os tours</Button>
          </div>
        </div>
      </LayoutWrapper>
    )
  }

  const totalPrice = tour.price // Preço fixo independente do número de passageiros (até 8)

  return (
    <LayoutWrapper>
<<<<<<< HEAD
      <div className="container-custom mx-auto py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-8 text-center">Reserva de Tour</h1>
          
          <Card className="p-6">
            <div className="mb-8">
              <Stepper 
                value={step} 
                onValueChange={setStep}
                className="w-full"
                indicators={{
                  completed: <Check className="h-4 w-4" />,
                }}
              >
                <div className="flex w-full">
                  <StepperItem step={1} completed={step > 1}>
                    <StepperTrigger>1</StepperTrigger>
                    <div className="flex flex-col items-center mt-2">
                      <StepperLabel>Informações</StepperLabel>
                    </div>
                  </StepperItem>
                  
                  <StepperConnector />
                  
                  <StepperItem step={2} completed={step > 2}>
                    <StepperTrigger>2</StepperTrigger>
                    <div className="flex flex-col items-center mt-2">
                      <StepperLabel>Revisão</StepperLabel>
                    </div>
                  </StepperItem>
                  
                  <StepperConnector />
                  
                  <StepperItem step={3}>
                    <StepperTrigger>3</StepperTrigger>
                    <div className="flex flex-col items-center mt-2">
                      <StepperLabel>Pagamento</StepperLabel>
                    </div>
                  </StepperItem>
                </div>
              </Stepper>
            </div>
            
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4 mb-6">
                  {tour.images && tour.images[0] && (
                    <div className="w-20 h-20 relative rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={tour.images[0]}
                        alt={tour.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h2 className="font-semibold text-lg">{tour.name}</h2>
                    <p className="text-gray-500">£{tour.price}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Seu nome completo"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="seu@email.com"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+44 000 0000"
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Data do tour</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${
                            !formData.date ? "text-muted-foreground" : ""
                          } ${errors.date ? "border-red-500" : ""}`}
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
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
                  </div>
=======
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
>>>>>>> 836f31ad909de4cd60c3918b6ed9eefa617e8d5c

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

<<<<<<< HEAD
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
                <h2 className="text-xl font-semibold">Resumo da Reserva</h2>
                
                <div className="space-y-4 bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Tour</p>
                      <p className="font-medium">{tour.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Preço</p>
                      <p className="font-medium">£{tour.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Data</p>
                      <p className="font-medium">
                        {formData.date ? format(formData.date, "PPP", { locale: ptBR }) : "Não selecionada"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Passageiros</p>
                      <p className="font-medium">{formData.passengers}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Malas</p>
                      <p className="font-medium">{formData.luggage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Hotel/Endereço</p>
                      <p className="font-medium">{formData.hotel || "Não informado"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Voo</p>
                      <p className="font-medium">{formData.flight || "Não informado"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nome</p>
                      <p className="font-medium">{formData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Telefone</p>
                      <p className="font-medium">{formData.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <Button onClick={handleNextStep}>
                    Ir para pagamento
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Pagamento</h2>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="mb-4">Você será redirecionado para o sistema de pagamento seguro do Stripe para finalizar sua reserva.</p>
                  
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <img 
                      src="https://www.frenchweb.fr/wp-content/uploads/2023/02/LOGO-850-stripe.png" 
                      alt="Stripe" 
                      className="h-12 object-contain" 
                    />
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-4">
                    Ao clicar em "Finalizar Pagamento", você será redirecionado para o Stripe para concluir sua compra de forma segura.
                  </p>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep} disabled={isProcessing}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <Button onClick={handleSubmit} disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        Finalizar Pagamento
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </Card>
=======
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

                    {clientSecret ? (
                      <StripeProvider clientSecret={clientSecret}>
                        <StripePaymentForm
                          onSuccess={handlePaymentSuccess}
                          onError={handlePaymentError}
                          total={totalPrice}
                          clientSecret={clientSecret}
                        />
                      </StripeProvider>
                    ) : (
                      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h3 className="text-yellow-800 font-semibold mb-2">Preparando pagamento...</h3>
                        <p className="text-yellow-700 text-sm">
                          Estamos configurando seu pagamento. Se este erro persistir, entre em contato conosco.
                        </p>
                        <Button 
                          onClick={handlePrevStep} 
                          variant="outline" 
                          className="mt-4"
                        >
                          Voltar e tentar novamente
                        </Button>
                      </div>
                    )}

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
>>>>>>> 836f31ad909de4cd60c3918b6ed9eefa617e8d5c
        </div>
      </div>
    </LayoutWrapper>
  )
}