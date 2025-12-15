import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const getSupabaseUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side: puede estar disponible
    return process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  }
  // Client-side: siempre debería estar disponible
  return process.env.NEXT_PUBLIC_SUPABASE_URL || ''
}

const getSupabaseAnonKey = () => {
  if (typeof window === 'undefined') {
    // Server-side: puede estar disponible
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  }
  // Client-side: siempre debería estar disponible
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
}

export function createClientComponentClient() {
  const url = getSupabaseUrl()
  const key = getSupabaseAnonKey()
  
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  
  return createBrowserClient(url, key)
}

// Función helper para obtener una instancia del cliente (lazy initialization)
// No exportar como constante para evitar problemas durante el build
export function getSupabaseClient() {
  if (typeof window === 'undefined') {
    throw new Error('getSupabaseClient should only be used on the client side. Use createClientComponentClient instead.')
  }
  
  const url = getSupabaseUrl()
  const key = getSupabaseAnonKey()
  
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  
  return createClient(url, key)
}
