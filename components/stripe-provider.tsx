"use client"

import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { ReactNode } from 'react'

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY não está definida nas variáveis de ambiente')
}

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.includes('aqui')) {
  throw new Error('Configure uma chave válida do Stripe em NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

interface StripeProviderProps {
  children: ReactNode
  clientSecret?: string
}

export function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0ea5e9',
      },
    },
  }

  // Verificar se o Stripe está configurado
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold mb-2">Configuração necessária</h3>
        <p className="text-red-600 text-sm">
          O sistema de pagamento está sendo configurado. Por favor, tente novamente em alguns minutos.
        </p>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  )
}