
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
  const options = clientSecret ? {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#0070f3',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
        focusBoxShadow: '0px 0px 0px 2px rgba(0, 112, 243, 0.4)',
        tabIconSelectedColor: '#0070f3',
      },
      rules: {
        '.Tab': {
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
        },
        '.Tab--selected': {
          backgroundColor: '#f8fafc',
          borderColor: '#0070f3',
        },
        '.Input': {
          borderRadius: '6px',
          border: '1px solid #e2e8f0',
          fontSize: '14px',
          padding: '12px',
        },
        '.Input--focus': {
          borderColor: '#0070f3',
          boxShadow: '0px 0px 0px 2px rgba(0, 112, 243, 0.2)',
        },
        '.Label': {
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '6px',
        }
      }
    },
    loader: 'auto',
  } : undefined

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  )
}
