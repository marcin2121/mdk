# ⚡ MDK (Molenda Development Kit)

[English Version](README.md) | **Polski**

---

<a name="polska-dokumentacja"></a>
## 🇵🇱 Polska Dokumentacja

Ewolucja standardowych boilerplate'ów na rynkach zachodnich. **MDK** (Molenda Development Kit) to udostępniony jako open-source, wysoce wyspecjalizowany zestaw deweloperski z wbudowaną architekturą "Self-Configuring Repository". Zamiast zmuszać programistę do układania dziesiątek plików w strukturze manualnie, MDK posiada wbudowany autorski instalator graficzny działający całkowicie w oparciu o środowisko Node.js.

---

### 🚀 Koronna Funkcja: The Setup Interceptor (GUI CLI)

Zanurzyliśmy proces budowania aplikacji webowych (SaaS, Wizytówki) w nowej, wizualnej pętli instalacyjnej. Gdy uruchomisz projekt po raz pierwszy, **Edge Proxy / Layout zablokuje wejście** i uruchomi dla Ciebie graficzny *"Setup Wizard"*.

#### Możliwości Instalatora Graficznego w przeglądarce:
- **🤖 Generatywne AI (Gemini / GPT):** Za pomocą jednego suwaka zmuszasz Sztuczną Inteligencję do wyplucia gotowego SEO-copywritingu (Tytuły Hero, opisy cta itp.) sprofilowanego pod Twoją branżę w locie.
- **👁️ Fullscreen Visual Builder z HMR na Żywo:** Przesuwaj i modyfikuj kolory przewodnie, typografie, oraz teksty z bocznego paska panelu Elementor-like i obserwuj ułamki sekund reakcji Iframe dzięki hot-reloadowi.
- **📦 Asynchroniczny Downloader z MDK-Registry:** Pobieraj zaawansowane pakiety B2B (Chatbot LLM, kalkulatory wycen, harmonogramy) ze zdalnego Githuba w tle. System sam zainstaluje pakiety NPM bez przerywania setupu.
- **🛠️ Topologia nesting i Database Generator:** Zlecaj generatorowi automatyczne wyplucie tras URL Route-groups oraz bezpiecznych integracji PostgreSQL ze skryptami migracji dla bazy Supabase.

---

### ⚙️ Wymagania Architektoniczne w Rdzeniu

* **React 19 Server Actions & useActionState:** Formularze przestały obciążać klienta. Bezpośrednio wbudowaliśmy akcje serwerowe (`use server`) kontrolujące stany bez jednego grama nadmiarowego JS u klienta.
* **Edge-Security (Supabase SSR Auth):** Absolutnie koszerna logika uwierzytelniania w Next.js. `createClient` osadzony po stronie serwera weryfikuje ciasteczka rzucając bezpieczną barierę na bazy danych.

---

### 🛠️ Stos Technologiczny

* **Framework:** Next.js 16+ (React 19, Server Components)
* **Weryfikacja danych ciasteczkowych:** `@supabase/ssr` (Edge Proxy)
* **Wizualna powłoka UI:** Tailwind CSS v4 + Framer Motion
* **Wielostanowa Walidacja End-to-End:** Zod (chroniący Server Actions przez błędnymi wstrzyknięciami)

---

### 📂 Architektura Projektu

```text
mdk/
├── app/                        # Główne wejścia routing'owe Next.js App Router
│   └── (public)/page.tsx       # Plik polimorficzny. Nadpisywany bezpośrednio przez Setup CLI i Node.js!
├── components/                 
│   └── wizard/                 # Mroczny Interfejs (Graficzny Setup), uruchamiany tylko w trybie Nieskonfigurowanym
├── lib/
│   ├── actions/                # Czyste Server Actions weryfikujące formularze ramy
│   ├── actions/install-module.ts # Skrypty asynchronicznego dociągania dodatków na żądanie
│   └── actions/setup-wizard.ts # Logika synchronizacji z mdk-registry i iniekcji kodu
└── scripts/                    # Narzędzia CLI i skrypty pomocnicze (`mdk.ts`)
```

---

### 🛠️ Narzędzie MDK CLI

Zarządzaj swoim projektem po instalacji za pomocą dedykowanego CLI:

```bash
# Dodaj moduł z automatyczną iniekcją kodu przez AST
npx mdk add hero-section
```

- **Zdalne Pobieranie**: Pobiera kod komponentu bezpośrednio z `mdk-registry`.
- **Iniekcja AST**: Automatycznie dodaje importy i tagi JSX do Twoich plików (np. `app/page.tsx`).
- **Zarządzanie Zależnościami**: Samodzielnie instaluje wymagane pakiety NPM.


---

### 🚀 Szybki Start (Złoty Grall 🏆)

Wdrożenie projektu opiera się na innowacyjnym doświadczeniu "Z punktu zerowego". Najszybsza droga to dedykowane CLI:

```bash
npx create-mdk my-app
```

**Co się dzieje:**
1. Wybierasz szablon (SaaS, Portfolio, Dashboard itp.).
2. CLI klonuje rdzeń i instaluje wszystkie zależności.
3. Odpalasz `http://localhost:3000` i kończysz konfigurację wizualnie.

2. **Zainstaluj rdzenne zależności architektoniczne:**
   ```bash
   npm install
   ```
   *(Uwaga: paczki modułów dociągną się automatycznie dopiero poprzez Setup na podstawie Twojego wyboru!)*

3. **Konfiguracja Env (.env.local):** 
   Nie musisz tworzyć plików ręcznie! Instalator MDK wygeneruje zabezpieczony plik `.env.local` automatycznie na dysku.

4. **Wczytaj i zmutuj instalator (Start):**
   ```bash
   npm run dev
   ```
   *Wejdź pod adres przeglądarkowy `http://localhost:3000`. Instalator zablokuje stronę i wymusi na Tobie wypełnienie procesu MDK System Initializer. Powodzenia Architekcie.*

#### 🔁 Reseting Instalatora (Powrót do MDK Initializera)
Gdy ukończysz instalator, opcja Setupu znika bezpowrotnie. Jeśli pragniesz zbudować wizualizację od zera i zmienić kolory – po prostu usuń ukryty plik konfiguracyjny `.molenda-setup` z głównego folderu, a następnie wywołaj odświeżenie wejścia na localhost. MDK powróci ze stanu spoczynku.

> Gotowy na bycie zatrudnionym natychmiastowo? Kod obroni zmysł inżynierski za Ciebie.
