"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckoutStepsProps {
  step: number
}

export function CheckoutSteps({ step }: CheckoutStepsProps) {
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
            <li key={step.name} className={cn(
              "relative",
              stepIdx !== steps.length - 1 ? 'flex-1' : ''
            )}>
              <div className="flex items-center">
                <div className="relative flex items-center justify-center">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center",
                      step.id < step
                        ? 'bg-primary text-white'
                        : step.id === step
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-500'
                    )}
                  >
                    {step.id < step ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                </div>
                <div className="ml-4 min-w-0 flex flex-col">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      step.id <= step ? 'text-primary' : 'text-gray-500'
                    )}
                  >
                    {step.name}
                  </span>
                  <span className="text-xs text-gray-500">{step.description}</span>
                </div>
              </div>
              {stepIdx !== steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-5 left-10 h-0.5 w-full",
                    step.id < step ? 'bg-primary' : 'bg-gray-200'
                  )}
                />
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}