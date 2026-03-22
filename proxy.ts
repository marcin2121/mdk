import { type NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  // Przekazanie Requestu do zintegrowanego silnika sesji opisanego w lib/
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Ignorujemy trasy publiczne, fonty, zoptymalizowane obrazki Nexta (_next) by nie spowalniać load time.
     * Uderzamy tylko w trasy stricte aplikacyjne.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
