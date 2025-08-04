"use client"

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