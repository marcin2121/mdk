"use server"

import { createClient } from "../supabase/server"

// Eventually this type should be inferred directly from Supabase CLI type generator
// For open-source and boilerplate universality, we declare it statically protecting boundaries (Zod-ready)
export type Service = {
  id: string
  created_at: string
  title: string
  slug: string
  short_description: string | null
  icon_name: string | null
  is_published: boolean
}

/**
 * Substantial Server Action (React 19)
 * Uruchamiana i kompilowana TYLKO na poziomie serwera w Node.js.
 * Getting rid of entire Supabase client SDK to reduce bundle and Time To Interactive!
 */
export async function getPublishedServices(): Promise<Service[]> {
  // Initialize stateless client page to pull env fields and cookies
  const supabase = await createClient()

  // Running queries directly to database at Server Component level.
  const { data, error } = await supabase
    .from('services')
    .select('id, created_at, title, slug, short_description, icon_name, is_published')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  // Rigorous error handling to display
  if (error) {
    console.error(`[Supabase_ERR] getPublishedServices:`, error.message)
    throw new Error("A hard error occurred during database instance communication.")
  }

  return data as Service[]
}

/**
 * Action prepared for quickly displaying a dedicated page, e.g., /services/[slug]
 */
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) {
    console.error(`[Supabase_WARN] getServiceBySlug brak danych dla slug [${slug}]:`, error.message)
    return null
  }

  return data as Service
}
