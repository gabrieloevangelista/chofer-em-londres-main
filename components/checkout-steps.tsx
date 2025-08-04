
"use client"

import { Check } from "lucide-react"

interface CheckoutStepsProps {
  currentStep: number
}

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const steps = [
    { id: 1, name: "Informações", description: "Dados pessoais" },
    { id: 2, name: "Data", description: "Escolha a data" },
    { id: 3, name: "Pagamento", description: "Finalizar compra" },
  ]

  return (
    <div className="mb-8">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}>
              <div className="flex items-center">
                <div className="relative flex items-center justify-center">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      step.id < currentStep
                        ? 'bg-primary text-white'
                        : step.id === currentStep
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step.id < currentStep ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                </div>
                <div className="ml-4 min-w-0 flex flex-col">
                  <span
                    className={`text-sm font-medium ${
                      step.id <= currentStep ? 'text-primary' : 'text-gray-500'
                    }`}
                  >
                    {step.name}
                  </span>
                  <span className="text-xs text-gray-500">{step.description}</span>
                </div>
              </div>
              {stepIdx !== steps.length - 1 && (
                <div
                  className={`absolute top-5 left-10 h-0.5 w-full ${
                    step.id < currentStep ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckoutStepsProps {
  step: number
}

export function CheckoutSteps({ step }: CheckoutStepsProps) {
  const steps = [
    { number: 1, title: "Informações" },
    { number: 2, title: "Pagamento" },
    { number: 3, title: "Confirmação" }
  ]

  return (
    <div className="flex items-center justify-center w-full max-w-md mx-auto">
      {steps.map((stepItem, index) => (
        <div key={stepItem.number} className="flex items-center">
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-medium transition-colors",
              step > stepItem.number
                ? "bg-green-500 border-green-500 text-white"
                : step === stepItem.number
                ? "bg-primary border-primary text-white"
                : "bg-gray-100 border-gray-300 text-gray-500"
            )}
          >
            {step > stepItem.number ? (
              <Check className="w-5 h-5" />
            ) : (
              stepItem.number
            )}
          </div>
          <div className="ml-2 text-sm">
            <div
              className={cn(
                "font-medium",
                step >= stepItem.number ? "text-primary" : "text-gray-500"
              )}
            >
              {stepItem.title}
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-12 h-0.5 mx-4",
                step > stepItem.number ? "bg-green-500" : "bg-gray-300"
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
