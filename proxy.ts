import { type NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/proxy'

export async function proxy(request: NextRequest) {
  // Forward request to the integrated session engine described in lib/
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Ignore public routes, fonts, and optimized Next.js images (_next) to avoid slowing down load time.
     * We only hit strictly application routes.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
