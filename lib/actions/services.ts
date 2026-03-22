"use server"

import { createClient } from "../supabase/server"

// Docelowo ten typ powinien być inferowany wprost z generatora typów Supabase CLI (np. Database['public']['Tables']['services']['Row'])
// Przez wzgląd na Open-Source i uniwerskę boilerplate'u deklarujemy go sztywno chroniąc granice (Zod-ready)
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
 * Pokaźna Server Action (React 19)
 * Uruchamiana i kompilowana TYLKO na poziomie serwera w Node.js.
 * Pozbywamy się całego SDK Supabase dla klienta redukując Bundle i Time To Interactive!
 */
export async function getPublishedServices(): Promise<Service[]> {
  // Inicjalizujemy całkowicie bezstanowego klienta wyciągającego środowiskowe zmienne i ciasteczka
  const supabase = await createClient()

  // Odpalanie zapytań bezpośrednio do bazy na poziomie Server Component.
  const { data, error } = await supabase
    .from('services')
    .select('id, created_at, title, slug, short_description, icon_name, is_published')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  // Rygorystyczna obsługa błędów do zaprezentowania rekruterowi
  if (error) {
    console.error(`[Supabase_ERR] getPublishedServices:`, error.message)
    throw new Error("Wystąpił twardy błąd podczas komunikacji z instancją bazy.")
  }

  return data as Service[]
}

/**
 * Akcja przygotowana pod szybkie wyświetlenie dedykowanej strony, np: /uslugi/[slug]
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
