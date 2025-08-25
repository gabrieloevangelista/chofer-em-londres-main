import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe-config'

export async function POST(request: NextRequest) {
  try {
    console.log('Recebendo solicitação para criar sessão de checkout...');
    const { tourId, tourName, price, customerData } = await request.json()
    console.log('Dados recebidos:', { tourId, tourName, price, customerData });

    // Verificar se a chave do Stripe está configurada
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY não está configurada');
      return NextResponse.json(
        { error: "Configuração do Stripe ausente" },
        { status: 500 }
      );
    }

    console.log('Criando sessão do Stripe...');
    const sessionConfig = {
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
      cancel_url: `${request.nextUrl.origin}/tour/${tourId}/checkout?cancelled=true`,
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);
    console.log('Sessão criada com sucesso:', { 
      sessionId: session.id, 
      url: session.url 
    });

    if (!session.url) {
      console.error('URL da sessão não foi gerada');
      return NextResponse.json(
        { error: "URL da sessão não foi gerada" },
        { status: 500 }
      );
    }

    return NextResponse.json({ sessionUrl: session.url });
  } catch (error) {
    console.error("Erro ao criar sessão de checkout:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      { error: `Erro ao processar pagamento: ${errorMessage}` },
      { status: 500 }
    );
  }
}
}
