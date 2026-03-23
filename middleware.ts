import { type NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Przekazanie Requestu do zintegrowanego silnika sesji opisanego w lib/
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Ignore public routes, fonts, and optimized Next.js images (_next) to avoid slowing down load time.
     * Uderzamy tylko w trasy stricte aplikacyjne.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
