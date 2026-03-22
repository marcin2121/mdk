"use server"

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../supabase/server'
import { z } from 'zod'

// Bezlitosna definicja typów dla struktury usługi
const insertServiceSchema = z.object({
  title: z.string().min(3, "Tytuł musi mieć co najmniej 3 znaki.").max(100, "Zbyt długi tytuł."),
  slug: z.string().min(2, "Slug jest wymagany (min 2 znaki).").regex(/^[a-z0-9-]+$/, "Slug może zawierać tylko małe litery, cyfry i myślniki bez spacji."),
  short_description: z.string().min(10, "Zbyt krótki opis (minimum 10 znaków)."),
  icon_name: z.enum(['zap', 'database', 'server', 'target', 'layers', 'shieldcheck']).default('target'),
  is_published: z.boolean().default(false)
})

export async function createServiceAction(prevState: any, formData: FormData) {
  // 1. Zabezpieczenie na poziomie Server Action: 
  // Zapobiega ręcznemu atakowi curl/Postman przez osobę znającą nazwę akcji RPC
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Odmowa wykonania. Moduł CMS wymaga sesji administratorskiej." }
  }

  // 2. Oczyszczenie wsadzonego FormData (Web API)
  const rawData = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    short_description: formData.get('short_description'),
    icon_name: formData.get('icon_name') || 'target',
    // Checkboxy w formularzach wysyłają tekst "on" jeśli są zaznaczone
    is_published: formData.get('is_published') === 'on'
  }

  // 3. Weryfikacja parserem Zod by wyłapać np. spacje w slug
  const parsed = insertServiceSchema.safeParse(rawData)

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  // 4. Synergizacja wpisu do chmurowego PostgreSQL poprzez RLS
  const { error } = await supabase
    .from('services')
    .insert([
      {
        title: parsed.data.title,
        slug: parsed.data.slug,
        short_description: parsed.data.short_description,
        icon_name: parsed.data.icon_name,
        is_published: parsed.data.is_published,
      }
    ])

  if (error) {
    // Rozpoznawanie powtarzającego się identyfikatora (Unique Constraint bazy pg)
    if (error.code === '23505') {
       return { error: "Podany identyfikator (Slug) jest już zajęty. Użyj unikalnej nazwy URL." }
    }
    return { error: `Błąd silnika DB: ${error.message}` }
  }

  // 5. Inwalidacja pamięci podręcznej. SSR przebuduje od razu stronę główną na potrzeby klientów.
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
