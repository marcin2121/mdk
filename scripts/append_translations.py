import os

file_path = r"c:\molendavdevelopment\mdk\lib\translations.ts"

if not os.path.exists(file_path):
    print("File not found")
    exit(1)

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

pl_additions = """
     // Templates Krok 2
     tmpl_saas_ai_name: "AI SaaS Dashboard",
     tmpl_saas_ai_desc: "Ciemny panel. Tabele konwertujące dla analityki oraz logowanie CMS SSR.",
     tmpl_client_beauty_name: "Klasyczna Oferta B2C",
     tmpl_client_beauty_desc: "Trzysekcyjny klasyk: O nas, Pełna sekcja adresowo-kontaktowa oraz Cennik.",
     tmpl_portfolio_minimal_name: "Minimal & Typo",
     tmpl_portfolio_minimal_desc: "Zatopienie układu w bezwględnej ciemności napędzanej olbrzymią typografią i wireframami.",

     // Pakiety Krok 5
     prettier_desc: "Automatyczne formatowanie kodu i sortowanie klas.",
     docker_desc: "Generuje konfiguracje do konteneryzacji.",
     husky_desc: "Weryfikacja kodu przed commitem.",
     prisma_desc: "Stabilny, dojrzały typowany ORM SQL.",
     drizzle_desc: "Lekki i hiper-szybki SQL-builder.",
     zustand_desc: "Prostota stanu bez reduxa.",
     query_desc: "Mądry cache asynchronicznych danych.",
     axios_desc: "Rozszerzony klient fetch API.",
     clerk_desc: "Wydajna autoryzacja Cloud.",
     nextauth_desc: "Lokalna, wolna tożsamość.",
     framer_desc: "Płynne animacje React.",
     gsap_desc: "Ciężkie, płynne animacje kinowe.",
     reacticons_desc: "Wszystkie ikony w jednym miejscu.",
     stripe_desc: "Płatności online i subskrypcje.",
     resend_desc: "Automatyzacja wysyłki maili.",
     uploadthing_desc: "Upload plików do chmury (S3).",
     sentry_desc: "Monitor błędów w produkcji.",
     redis_desc: "Szybka baza do cache / rate-limits.",
     datefns_desc: "Łatwe zarządzanie datami React.",
     pusher_desc: "Websockety do chatu / live eventów.",
     markdown_desc: "Wsparcie wpisów MD na bloga.",
     sonner_desc: "Szybkie powiadomienia wyskakujące (Toaster)."
"""

en_additions = """
     // Templates Krok 2
     tmpl_saas_ai_name: "AI SaaS Dashboard",
     tmpl_saas_ai_desc: "Dark Dashboard. High-converting tables for analytics and CMS SSR login.",
     tmpl_client_beauty_name: "Classic B2C Landing",
     tmpl_client_beauty_desc: "Three-section classic: About Us, Address & Contact, and Pricing.",
     tmpl_portfolio_minimal_name: "Minimal & Typo",
     tmpl_portfolio_minimal_desc: "Submerge layout in absolute darkness powered by massive typography and wireframes.",

     // Pakiety Krok 5
     prettier_desc: "Auto-formatting of code and sorting classes.",
     docker_desc: "Generates configurations for containerization.",
     husky_desc: "Pre-commit code validation.",
     prisma_desc: "Stable, mature typed SQL ORM.",
     drizzle_desc: "Lightweight and hyper-fast SQL builder.",
     zustand_desc: "Simple state management without Redux.",
     query_desc: "Smart caching of asynchronous data.",
     axios_desc: "Extended fetch API client.",
     clerk_desc: "High-performance Cloud authorization.",
     nextauth_desc: "Local, independent identity solution.",
     framer_desc: "Smooth React animations.",
     gsap_desc: "Heavy, cinematic fluid animations.",
     reacticons_desc: "All icons in one single place.",
     stripe_desc: "Online payments and subscriptions.",
     resend_desc: "Email delivery automation.",
     uploadthing_desc: "Upload files to cloud (S3).",
     sentry_desc: "Production error monitoring.",
     redis_desc: "Fast Cache / rate-limit database.",
     datefns_desc: "Easy React date management.",
     pusher_desc: "Websockets for chat / live events.",
     markdown_desc: "Markdown blog post support.",
     sonner_desc: "Fast pop-up notifications (Toaster)."
"""

# Wstrzyknięcie PL:
target_pl_tail = 'final_build: "Finałowa Kompilacja",\n     wait_script: "Node.js oczekuje na komendę wstrzyknięcia..."'
if target_pl_tail in content:
    content = content.replace(target_pl_tail, target_pl_tail + ",\n" + pl_additions.strip())

# Wstrzyknięcie EN:
target_en_tail = 'final_build: "Final Compile & Build",\n     wait_script: "NodeJS is awaiting server directive execution trigger..."'
if target_en_tail in content:
    content = content.replace(target_en_tail, target_en_tail + ",\n" + en_additions.strip())

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("[SUCCESS] Dictionary appenended with sub-item descriptions templates.")
