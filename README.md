# ⚡ Złoty Boilerplate

Potężny i zaawansowany szablon startowy (starter kit) stworzony z myślą o agencjach i freelancerach, którzy chcą dostarczać klientom błyskawiczne, bezpieczne i zoptymalizowane pod kątem SEO strony wizytówkowe oraz aplikacje webowe. Stanowi absolutną przewagę biznesową oraz technologiczną nad konwencjonalnymi, ociężałymi instancjami WordPressa.

## 🚀 Główne założenia i funkcjonalności

- **Modułowa budowa niczym klocki LEGO**: Architektura oparta na gotowych sekcjach wizualnych (Hero, FAQ, Cenniki, Zaufanie) ułatwia błyskawiczne budowanie i układanie optymalnych ścieżek konwersji (UX).
- **Zabezpieczony Headless CMS**: Klienci wprowadzają w panelu wyłącznie ustrukturyzowane wiersze (czysty tekst, Markdown, wgrają pojedyncze zdjęcia). Nie posiadają zabałaganionego kreatora wizualnego, co gwarantuje 100% ochronę oryginalnego designu, spójności marki oraz wydajności!
- **Wydajność Core Web Vitals na poziomie 99-100/100**: Zautomatyzowana kompresja i optymalizacja obrazów (konwersja do WebP/AVIF o 90-95% mniejszej wadze) bezpośrednio we wbudowanych mechanizmach rzutowania obrazków.
- **Zautomatyzowane Techniczne SEO**: Dynamicznie generowane meta tytuły, opisy, karty Open Graph oraz wbudowane generatory danych strukturalnych (Schema.org / JSON-LD) - skalujące widoczność lokalnych firm.

## 🛠️ Stos Technologiczny (Tech Stack)

* **Framework:** Next.js 16 (App Router, React Server Components)
* **Styling:** Tailwind CSS v4 (semantyczne zmienne globalne wpięte w `globals.css`)
* **UI Components:** shadcn/ui (Radix UI, idealna budowa dostępności - a11y)
* **Baza Danych & Auth:** Supabase (szybki PostgreSQL po API, wbudowany autoryzator sesyjny, włączone Row Level Security)
* **Walidacja i Formularze:** Zod + React Hook Form
* **Infrastruktura Wdrożenia:** Architektura przygotowana pod konteneryzację (Docker) i bezpośredni deployment na instancje VPS (Hetzner) zarządzane przez np. Coolify.

## 📂 Architektura Projektu

Projekt dzieli się na wyraźne strefy izolując autorski panel administracyjny od publicznego frontendu oraz oddzielając głupie/"ślepe" komponenty UI od złożonych klocków biznesowych.

```text
zloty-boilerplate/
├── src/                  # Kod źródłowy (omówiony wyżej)
├── .env.example          # Wzór bezpiecznych zmiennych środowiskowych Supabase
├── .prettierrc.json      # Rygorystyczne normy formatowania i zautomatyzowane CSS klas Tailwind
├── Dockerfile            # Plik konfiguracyjny do utworzenia lekkiego, ostatecznego obrazu (Standalone)
└── docker-compose.yml    # Zestaw usług wdrożeniowych optymalnego środowiska
```

## 🏗️ Baza Danych (Supabase)

Wbudowane modele w bazie danych (PostgreSQL) posiadają włączone zabezpieczenia **Row Level Security (RLS)**. Umożliwia to zablokowanie niezalogowanym użytkownikom wprowadzania modyfikacji. Panel admina korzysta z autoryzowanej sesji HTTP, natomiast żądania o treść z publicznego frontendu widzą i renderują na stronie wyłącznie wpisy i tabele posiadające flagę `is_published = true`. 

* **`services`** - moduł usług wspierający zaawansowane meta opisy oraz referencje ikon (Lucide).
* **`blog_posts`** - wpisy blogowe podstron służące pozycjonowaniu "Long-tail SEO".
* **`faq`** - usystematyzowane wiersze służące dla generatora Schema FAQPage.
* **`testimonials`** - łatwy system ocen i opinii klientów budujących Social Proof blisko ścieżek konwersyjnych.

*Szablony zapytań SQL do wygenerowania tabel znajdziesz w pliku `supabasetodo/sqleditor.md`.*

---

## 💻 Środowisko Lokalne

1. Sklonuj repo i przejdź do folderu aplikacji:
   ```bash
   git clone [TWOJ_ADRES_REPO] zloty-boilerplate
   cd zloty-boilerplate
   ```
2. Zainstaluj biblioteki node'owe ze świetną polityką zależności w package:
   ```bash
   npm install
   ```
3. Skonfiguruj klucze do Supabase - zmień nazwę `.env.example` (bądź stwórz plik) na `.env.local` i wklej swoje klucze wyciągnięte z zakładki Project Settings z Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://TWOJAKONCOWKA.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbG..."
   ```
4. Odpal środowisko developerskie Next.js:
   ```bash
   npm run dev
   ```
5. Rozpocznij pisanie fenomenalnego kodu! Zmiany naniesione w folderze będą odświeżane na żywo za sprawą `Hot Module Replacement (HMR)`. 
