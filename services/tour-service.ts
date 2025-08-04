import { supabase } from '../lib/supabase';
import type { TouristAttraction } from '../types/tourist-attraction';

export async function getTours() {
  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching tours:', error);
    return [];
  }

  // Log para debug
  console.log('Tours data from Supabase:', data);

  // Mapear os dados do Supabase para o formato TouristAttraction
  return data.map((tour): TouristAttraction => ({
    id: tour.id,
    name: tour.name,
    image: tour.image_url || '',
    duration: `${tour.duration} horas`,
    price: tour.price,
    category: tour.category as any,
    isPromotional: tour.is_promotion || false,
    isHighlighted: tour.is_featured || false,
    slug: tour.slug || '',
  }));
}

export async function getTourBySlug(slug: string) {
  console.log('Buscando tour com slug:', slug);
  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching tour:', error);
    return null;
  }
  
  console.log('Tour encontrado:', data);

  // Retornando os dados do tour com o ID original e o slug para a URL
  return {
    id: data.id, // Mantemos o ID como identificador único
    name: data.name,
    image: data.image_url || '',
    duration: `${data.duration} horas`,
    price: data.price,
    category: data.category as any,
    isPromotional: data.is_promotion || false,
    isHighlighted: data.is_featured || false,
    description: data.description,
    shortDescription: data.short_description,
    slug: data.slug, // Usado para a URL amigável
  };
}

export async function getTourById(id: string) {
  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching tour:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    image: data.image_url || '',
    duration: `${data.duration} minutos`,
    price: data.price,
    category: data.category as any,
    isPromotional: data.is_promotion || false,
    isHighlighted: data.is_featured || false,
    description: data.description,
    shortDescription: data.short_description,
  };
}

export async function createAppointment(appointmentData: {
  tour_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  appointment_date: string;
  appointment_time: string;
  passengers: number;
  special_requests?: string;
}) {
  const { data, error } = await supabase
    .from('appointments')
    .insert(appointmentData)
    .select();

  if (error) {
    console.error('Error creating appointment:', error);
    return { success: false, error };
  }

  return { success: true, data: data[0] };
}

export async function createContact(contactData: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  tour_id?: string;
}) {
  const { data, error } = await supabase
    .from('contacts')
    .insert(contactData)
    .select();

  if (error) {
    console.error('Error creating contact:', error);
    return { success: false, error };
  }

  return { success: true, data: data[0] };
}

export async function createTransfer(transferData: {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  transfer_date: string;
  transfer_time: string;
  airport: string;
  flight_number?: string;
  hotel_address?: string;
  passengers: number;
  special_requests?: string;
}) {
  const { data, error } = await supabase
    .from('transfers')
    .insert(transferData)
    .select();

  if (error) {
    console.error('Error creating transfer:', error);
    return { success: false, error };
  }

  return { success: true, data: data[0] };
}