
import { NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables for booking API')
}

const supabase = createClient(supabaseUrl || '', supabaseServiceKey || '')

export async function POST(request: Request) {
  try {
    const bookingData = await request.json()

    // Inserir dados da reserva na tabela bookings
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          tour_id: bookingData.tourId,
          tour_name: bookingData.tourName,
          customer_name: bookingData.customerName,
          customer_email: bookingData.customerEmail,
          customer_phone: bookingData.customerPhone,
          tour_date: bookingData.tourDate,
          passengers: bookingData.passengers,
          luggage: bookingData.luggage,
          hotel: bookingData.hotel,
          flight: bookingData.flight,
          total_price: bookingData.totalPrice,
          status: bookingData.status,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.error('Erro ao inserir reserva:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar reserva' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      booking: data[0] 
    })

  } catch (error) {
    console.error('Erro na API de reservas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
