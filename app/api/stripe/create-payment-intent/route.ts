
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe-config"

export async function POST(request: Request) {
  try {
    const { amount, currency = 'gbp', metadata } = await request.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
      payment_method_types: ['card'],
    })

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret 
    })
  } catch (error) {
    console.error("Erro ao criar Payment Intent:", error)
    return NextResponse.json(
      { error: "Erro ao processar pagamento" },
      { status: 500 }
    )
  }
}
