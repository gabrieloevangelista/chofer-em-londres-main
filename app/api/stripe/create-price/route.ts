import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil'
})

export async function POST(request: Request) {
  try {
    const { product, unit_amount, currency } = await request.json()

    const price = await stripe.prices.create({
      product,
      unit_amount,
      currency
    })

    return NextResponse.json(price)
  } catch (error) {
    console.error('Erro ao criar preço:', error)
    return NextResponse.json({ error: 'Erro ao criar preço' }, { status: 500 })
  }
}
