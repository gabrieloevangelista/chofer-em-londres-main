import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export async function POST(request: Request) {
  try {
    const { price, quantity } = await request.json()

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price,
          quantity
        }
      ],
      after_completion: { type: 'redirect', redirect: { url: '/success' } }
    })

    return NextResponse.json(paymentLink)
  } catch (error) {
    console.error('Erro ao criar link de pagamento:', error)
    return NextResponse.json({ error: 'Erro ao criar link de pagamento' }, { status: 500 })
  }
}
