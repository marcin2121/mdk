"use server"

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../supabase/server'
import { z } from 'zod'

// Twarde Zod Schema chroniące logikę serwera przed atakami bazodanowymi
const loginSchema = z.object({
  email: z.string().email("Nieprawidłowy format adresu email."),
  password: z.string().min(6, "Token autoryzacyjny musi posiadać minimum 6 znaków."),
})

/**
 * Server Action do procesowania uwierzytelniania HTTP z formularza React 19 wg wzorca useActionState.
 */
export async function login(prevState: { error: string }, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Walidujemy stringi z wejścia chroniąc przed błędem logicznym DB.
  const parsed = loginSchema.safeParse({ email, password })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()

  // Bicie po API do instancji Supabase Auth
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  // Odmowa autoryzacji (złe hasło / brak konta)
  if (error) {
    return { error: "Odmowa dostępu. Nierozpoznane wektory logowania." }
  }

  // Wymuszenie re-renderowania ułomnego cache (SSR) by pokazać zalogowany stan
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

/**
 * Server Action usuwająca sesyjne ciasteczka niszcząc sesję CMS.
 */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
