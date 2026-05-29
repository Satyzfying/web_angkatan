import { createClient, type SupabaseClient } from '@supabase/supabase-js'

type SupabaseClientRole = 'anonymous' | 'authenticated' | 'service-role'

type CreateSupabaseServerClientOptions = {
  role?: SupabaseClientRole
}

const getSupabaseUrl = () => {
  const supabaseUrl = process.env.SUPABASE_URL

  if (!supabaseUrl) {
    throw new Error('Missing SUPABASE_URL environment variable.')
  }

  return supabaseUrl
}

const getSupabaseKey = (role: SupabaseClientRole) => {
  const anonKey = process.env.SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (role === 'service-role') {
    if (!serviceRoleKey) {
      throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable.')
    }

    return serviceRoleKey
  }

  if (!anonKey) {
    throw new Error('Missing SUPABASE_ANON_KEY environment variable.')
  }

  return anonKey
}

export const createSupabaseServerClient = (
  options: CreateSupabaseServerClientOptions = {}
): SupabaseClient => {
  const role = options.role ?? 'anonymous'

  return createClient(getSupabaseUrl(), getSupabaseKey(role), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  })
}

export const createSupabaseServiceRoleClient = (): SupabaseClient =>
  createSupabaseServerClient({ role: 'service-role' })

export const createSupabaseAnonymousClient = (): SupabaseClient =>
  createSupabaseServerClient({ role: 'anonymous' })

export const createSupabaseAuthenticatedClient = (): SupabaseClient =>
  createSupabaseServerClient({ role: 'authenticated' })