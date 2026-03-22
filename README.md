# ⚡ MDK (Molenda Development Kit)

Ewolucja standardowych boilerplate'ów na rynkach zachodnich. **MDK** (Molenda Development Kit) to udostępniony jako open-source, wysoce wyspecjalizowany zestaw deweloperski z wbudowaną architekturą "Self-Configuring Repository". Zamiast zmuszać programistę do układania dziesiątek plików w strukturze manualnie, MDK posiada wbudowany autorski instalator graficzny działający całkowicie w oparciu o środowisko Node.js.

Projekt stworzony z myślą o natychmiastowym budowaniu bezpiecznego, w pełni opartego o **Supabase SSR** kodu równego poziomem dojrzałym środowiskom inżynierskim.

---

## 🚀 Koronna Funkcja: The Setup Interceptor (GUI CLI)

Zanurzyliśmy proces budowania aplikacji webowych (SaaS, E-commerce, Wizytówki) w nowej, nieodwracalnej pętli instalacyjnej. Gdy uruchomisz projekt po raz pierwszy, **Edge Middleware / Layout zablokuje wejście** i uruchomi dla Ciebie graficzny *"Setup Wizard"*.

Możliwości Instalatora Graficznego w przeglądarce:
- **Zero-Config Template Generator**: Za pomocą interfejsu określasz dominujący pion biznesowy projektu (np. B2B, Portfolio, Lokalny Biznes).
- **Zmienne Graficzne (Design Tokens)**: Definiujesz w locie z palety barw kolor podstawowy i wpisujesz nazwę aplikacji. Informacja zapisywana jest do ukrytego pliku konfiguracyjnego środowiska (`.molenda-setup`).
- **Dynamic NPM Injection**: Server Action na dnie instalatora (oparta na `child_process.execAsync`) pobiera zdefiniowane dla szablonu pakiety niezbędne do jego działania ze środowiska NPM.
- **FS Code Injection (Iniekcja Kodu Zewnętrznego)**: Używając Node.js `fs.writeFileSync(...)`, aplikacja modyfikuje plik `app/(public)/page.tsx` wklejając tam precyzyjny kod szablonu.
- **Narzędzia i Pakiety Deweloperskie (Showcase)**: Wbudowany instalator pozwala jednym kliknięciem doinstalować paczki takie jak Prisma, Drizzle, Zustand, Framer Motion czy generować skrypty Docker i m.in. Sonner Toaster.

## ⚙️ Wymagania Architektoniczne w Rdzeniu

*   **React 19 Server Actions & useActionState**: Kod przestał sprawnie opierać się na `useState` i `useEffect`. Bezpośrednio wbudowaliśmy akcje serwerowe (`use server`) podłączone pod formularze za pomocą hooków kontrolujących ładowania bez jednego grama nadmiarowego JS u klienta.
*   **Edge-Security (Supabase SSR Auth)**: Absolutnie koszerna logika uwierzytelniania w Next.js. `createClient` osadzony po stronie API weryfikuje Cookies z uprawnieniami RLS w sercu układu. Middleware przechwytuje wejścia uciążliwych gości rzucając przekierowanie `301`, chroniąc komponenty.
*   **Baza Danych w pełni oparta na RLS (Row Level Security)**: Żadne bezmyślne zapytanie bazodanowe po stronie klienta nie ma prawa zadziałać. Operacje CRUD dołączone dla panelu CMS przechodzą walidację Zod Schema w zamkniętych węzłach backendu.
*   **Strict Type-Safety**: 100% obłożenia TypeScriptem od pierwszej akcji serwerowej, aż w głąb żądania interfejsowego przy API Supabase.

---

## 🛠️ Stos Technologiczny

*   **Silnik i Framework:** Next.js 16 (React 19, Server Components)
*   **Zarządzanie Stanem Bazy Ciasteczkami:** `@supabase/ssr` (Edge Middleware)
*   **Stylowanie UI / Framework Czasu Mocy:** Tailwind CSS v4
*   **Wbudowana Baza Komponentów:** Radix UI / shadcn/ui (Accessible Components)
*   **Wielostanowa Walidacja End-to-End:** Zod (chroniący Server Actions przez błędnymi wstrzyknięciami SQL Injection)
*   **Architektura Bazy Relacyjnej:** PostgreSQL (zbudowana pod Edge Functions Supabase)

---

## 📂 Architektura Projektu

Projekt dzieli się na silnie stypizowane, odporne na potężne wektory awarii bloki infrastrukturalne.

```text
mdk/
├── app/                        # Główne wejścia routing'owe Next.js App Router
│   └── (public)/page.tsx       # Plik polimorficzny. Nadpisywany bezpośrednio przez Setup CLI i Node.js!
├── components/                 
│   └── wizard/                 # Mroczny Interfejs (Graficzne CLI Setupu), uruchamiany tylko w trybie Nieskonfigurowanym
├── lib/
│   ├── actions/                # Czyste Server Actions weryfikujące tożsamość użytkownika CMS
│   ├── supabase/               # Implementacja wzorca Supabase SSR Server i Middleware
│   └── actions/setup-wizard.ts # Logika synchronizacji z mdk-registry i iniekcji kodu
├── .env.example                # Zbiór wymaganych kluczy URL i JWK (anon_key)
├── middleware.ts               # Główny zamek odrzucający intruzów z nieaktywnych tras
└── .molenda-setup              # Osobisty ukryty znacznik stanu Frameworka (pojawia się po instalacji)
```

---

## 💻 Instrukcja Ogniska Startowego

Wdrożenie projektu opiera się na innowacyjnym doświadczeniu "Z punktu zerowego".

1. **Sklonuj strukturę roboczą i przejdź do folderu:**
   ```bash
   git clone [TWOJ_ADRES_REPO] mdk
   cd mdk
   ```

2. **Zainstaluj rdzenne zależności architektoniczne:**
   ```bash
   npm install
   ```
   *(Uwaga: paczki zewnętrzne np. `three.js` czy `Framer Motion` wgrają się automatycznie dopiero poprzez Setup Wizard na podstawie Twojego wyboru!)*

3. **Konfiguracja Env (.env.local):** 
   Nie musisz tworzyć plików ręcznie! Graficzny instalator MDK (Krok 6) zapyta Cię o dane do API/Supabase oraz klucze i **wygeneruje zabezpieczony plik `.env.local` automatycznie** na Twoim dysku ułatwiając całą pracę.

4. **Wczytaj i zmutuj instalator (Start):**
   ```bash
   npm run dev
   ```
   *Wejdź pod adres przeglądarkowy `http://localhost:3000`. Instalator zablokuje stronę i wymusi na Tobie wypełnienie procesu MDK System Initializer. Powodzenia Architekcie.*

### 🔁 Reseting Instalatora (Powrót do MDK Initializera)
Gdy ukończysz instalator, a MDK wstrzyknie Ci wybrany kod do front-endu generując 70% strony za Ciebie, opcja Setupu znika bezpowrotnie (zamrażana znacznikiem). Jeśli pragniesz zbudować wizualizację od zera i zmienić np. kolory i nazwy brandów wstrzykiwane przez generatory MDK – po prostu usuń ostateczny plik konfiguracyjny (JSON) `.molenda-setup` ukryty w głównym folderze, a następnie wywołaj odświeżenie wejścia na localhost. MDK powróci ze stanu spoczynku.

> Gotowy na bycie zatrudnionym natychmiastowo? Kod obroni zmysł inżynierski za Ciebie.
