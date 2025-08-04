
"use client"

import React, { useState } from 'react'
import {
  PaymentElement,
  useStripe,
  useElements,
  AddressElement
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

interface StripePaymentFormProps {
  onSuccess: () => void
  onError: (error: string) => void
  total: number
}

export function StripePaymentForm({ onSuccess, onError, total }: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/tour/success`,
      },
    })

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "Erro no pagamento")
        onError(error.message || "Erro no pagamento")
      } else {
        setMessage("Erro inesperado no pagamento")
        onError("Erro inesperado no pagamento")
      }
    } else {
      onSuccess()
    }

    setIsLoading(false)
  }

  const paymentElementOptions = {
    layout: "tabs" as const,
    paymentMethodOrder: ['card', 'google_pay', 'apple_pay'],
    fields: {
      billingDetails: {
        address: {
          country: 'auto',
        },
      },
    },
    wallets: {
      applePay: 'auto',
      googlePay: 'auto',
    },
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-gray-900 mb-2 block">
            Informações de Pagamento
          </Label>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <PaymentElement 
              options={paymentElementOptions}
              className="bg-white"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-900 mb-2 block">
            Endereço de Cobrança
          </Label>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <AddressElement 
              options={{
                mode: 'billing',
                fields: {
                  phone: 'always',
                },
                validation: {
                  phone: {
                    required: 'always',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {message && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {message}
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Total:</span>
          <span>£{total}</span>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          `Pagar £${total}`
        )}
      </Button>
    </form>
  )
}
