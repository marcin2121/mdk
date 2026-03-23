import os

file_path = r"c:\molendavdevelopment\mdk\components\wizard\setup-wizard.tsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. TEMPLATES:
templates_old = """const TEMPLATES: Record<string, any[]> = {
  saas: [
    { id: 'saas-ai', name: 'AI SaaS Dashboard', desc: 'Ciemny panel. Tabele konwertujące dla analityki oraz logowanie CMS SSR.', packages: ['lucide-react', 'clsx'] }
  ],
  client: [
    { id: 'client-beauty', name: 'Klasyczna Oferta B2C', desc: 'Trzysekcyjny klasyk: O nas, Pełna sekcja adresowo-kontaktowa oraz Cennik.', packages: ['lucide-react'] }
  ],
  portfolio: [
    { id: 'portfolio-minimal', name: 'Minimal & Typo', desc: 'Zatopienie układu w bezwględnej ciemności napędzanej olbrzymią typografią i wireframami.', packages: ['lucide-react'] }
  ]
}"""

templates_new = """const TEMPLATES: Record<string, any[]> = {
  saas: [
    { id: 'saas-ai', name: 'tmpl_saas_ai_name', desc: 'tmpl_saas_ai_desc', packages: ['lucide-react', 'clsx'] }
  ],
  client: [
    { id: 'client-beauty', name: 'tmpl_client_beauty_name', desc: 'tmpl_client_beauty_desc', packages: ['lucide-react'] }
  ],
  portfolio: [
    { id: 'portfolio-minimal', name: 'tmpl_portfolio_minimal_name', desc: 'tmpl_portfolio_minimal_desc', packages: ['lucide-react'] }
  ]
}"""

content = content.replace(templates_old, templates_new)

# 2. OPTIONAL_PACKAGES – podmieniamy całe linijki z opisami na name_keys
content = content.replace("'Automatyczne formatowanie kodu i sortowanie klas.'", "'prettier_desc'")
content = content.replace("'Generuje konfiguracje do konteneryzacji.'", "'docker_desc'")
content = content.replace("'Weryfikacja kodu przed commitem.'", "'husky_desc'")

content = content.replace("'Stabilny, dojrzały typowany ORM SQL.'", "'prisma_desc'")
content = content.replace("'Lekki i hiper-szybki SQL-builder.'", "'drizzle_desc'")

content = content.replace("'Prostota stanu bez reduxa.'", "'zustand_desc'")
content = content.replace("'Mądry cache asynchronicznych danych.'", "'query_desc'")
content = content.replace("'Rozszerzony klient fetch API.'", "'axios_desc'")

content = content.replace("'Wydajna autoryzacja Cloud.'", "'clerk_desc'")
content = content.replace("'Lokalna, wolna tożsamość.'", "'nextauth_desc'")

content = content.replace("'Płynne animacje React.'", "'framer_desc'")
content = content.replace("'Ciężkie, płynne animacje kinowe.'", "'gsap_desc'")
content = content.replace("'Wszystkie ikony w jednym miejscu.'", "'reacticons_desc'")

content = content.replace("'Płatności online i subskrypcje.'", "'stripe_desc'")
content = content.replace("'Automatyzacja wysyłki maili.'", "'resend_desc'")
content = content.replace("'Upload plików do chmury (S3).'", "'uploadthing_desc'")
content = content.replace("'Monitor błędów w produkcji.'", "'sentry_desc'")

content = content.replace("'Szybka baza do cache / rate-limits.'", "'redis_desc'")
content = content.replace("'Łatwe zarządzanie datami React.'", "'datefns_desc'")
content = content.replace("'Websockety do chatu / live eventów.'", "'pusher_desc'")
content = content.replace("'Wsparcie wpisów MD na bloga.'", "'markdown_desc'")
content = content.replace("'Szybkie powiadomienia wyskakujące (Toaster).'", "'sonner_desc'")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("[SUCCESS] Static texts converted to translation keys inside lists constants.")
Exception = None
