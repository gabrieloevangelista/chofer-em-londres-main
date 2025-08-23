"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2, Check } from "lucide-react"
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
    }
  }

  const handlePrevStep = () => {
    setStep(prev => prev - 1)
  }

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

  return (
    <LayoutWrapper>
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
        </div>
      </div>
    </LayoutWrapper>
  )
}
