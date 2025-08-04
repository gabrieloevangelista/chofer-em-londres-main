import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe-config"
import { format } from "date-fns"

export async function POST(request: Request) {
  try {
    const { tourId, tourName, price, customerData } = await request.json()

    // Criar uma sessão de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: tourName,
              description: `Data: ${format(new Date(customerData.date), 'dd/MM/yyyy')}\nPassageiros: ${customerData.passengers}, Malas: ${customerData.luggage}`,
            },
            unit_amount: price * 100, // Stripe espera o valor em centavos
          },
          quantity: 1,
        },
      ],
      customer_email: customerData.email,
      metadata: {
        tourId,
        tourName,
        tourDate: customerData.date,
        passengers: customerData.passengers,
        luggage: customerData.luggage,
        hotel: customerData.hotel,
        flight: customerData.flight,
        customerName: customerData.name,
        customerPhone: customerData.phone,
      },
      mode: "payment",
      success_url: `${request.headers.get("origin")}/tour/${tourId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}/tour/${tourId}`,
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
