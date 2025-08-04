
import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

// Verificação de variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.warn('NEXT_PUBLIC_SUPABASE_URL não está definida nas variáveis de ambiente')
}

if (!supabaseAnonKey) {
  console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY não está definida nas variáveis de ambiente')
}

// Fallback client for when environment variables are not set
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export function createSupabaseClient() {
  if (typeof window !== 'undefined' && supabaseUrl && supabaseAnonKey) {
    return createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  return supabase
}
