import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Kluczowa logika obsługująca cykl życia ciasteczek i odświeżania tokenów.
 * Wrzucane jako główny Middleware Next.js by chronić trasy na najniższym poziomie Edge.
 */
export async function updateSession(request: NextRequest) {
  // Przejmujemy natywne Next.js requests
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Autoryzacja i wyciąganie identyfikatora sesji. 
  // Bez tego `await`, token by wygasł a Server Components zrzuciły się w Error.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Zaawansowane blokowanie tras bez API handlersów (Edge zabezpieczenia)
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/admin')

  // Odrzucenie intruza ze strefy CMS z zachowaniem 301 do logowania
  if (isAdminRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Wyrzucenie zalogowanego usera spowrotem do panelu (brak wejścia drugi raz na login page)
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
