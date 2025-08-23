import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe-config'

export async function POST(request: NextRequest) {
  try {
    const { tourId, tourName, price, customerData } = await request.json()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: tourName,
              description: `Tour em Londres - ${customerData.passengers} passageiro(s)`,
            },
            unit_amount: Math.round(price * 100), // Convert to pence
          },
          quantity: 1,
        },
      ],
      customer_email: customerData.email,
      metadata: {
        tourId: tourId.toString(),
        tourName,
        tourDate: customerData.date,
        passengers: customerData.passengers,
        hotel: customerData.hotel,
        flight: customerData.flight || '',
        customerName: customerData.name,
        customerEmail: customerData.email,
        customerPhone: customerData.phone,
      },
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/tour/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/tour/checkout?cancelled=true`,
    })

    return NextResponse.json({ sessionUrl: session.url })
  } catch (error) {
    console.error("Erro ao criar sessão de checkout:", error)
    return NextResponse.json(
      { error: "Erro ao processar pagamento" },
      { status: 500 }
    )
  }
}
