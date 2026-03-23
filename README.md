# ⚡ MDK (Molenda Development Kit)

[🇬🇧 English](#-english-documentation) | [🇵🇱 Polski](#-polska-dokumentacja)

---

<a name="english-documentation"></a>
## 🇬🇧 English Documentation

The evolution of standard boilerplates. **MDK** (Molenda Development Kit) is an open-source, highly specialized development kit featuring a "Self-Configuring Repository" architecture. Instead of forcing developers to manually arrange dozens of files, MDK includes a built-in, fully interactive graphical installer powered by Node.js and Next.js.

Designed for immediately building secure, full-stack **Supabase SSR** applications corresponding to mature engineering standards.

---

### 🚀 Key Feature: The Visual Setup Interceptor (GUI Builder)

We have transformed the web application setup process (SaaS, Analytics, Portfolios) into a direct, visual experience. On first run, the **Edge Middleware** intercepts requests and boots into an immersive *"Setup Wizard"* instead of just loading a blank page.

#### Features of the Interface:
- **🤖 Real-Time AI Generation (V1 Gemini/GPT):** Simply toggle "AI Copywriting" and the installer generates contextual SEO titles, descriptive paragraphs, and Call to Actions customized for your business vertical in real time.
- **👁️ Fullscreen Visual Builder with Real-Time HMR:** Drag side panels to adjust primary colors, typography tokens, structures, and headlines. Use an immersive preview frame loaded with instant React Hot Module Replacement as you type or tweak.
- **📦 Async Module Registry Downloader:** Install business-ready components (AI B2B Chatbots, interactive cost estimators, sliders, nested FAQ accordions) from the remote `mdk-registry` repository asynchronously. Node.js resolves and triggers required NPM install commands on request without freezing the setup cycle.
- **🛠️ Zero-Config Database Layout (Topology Manager):** Automatically generate physical URL nested layouts Route Groups and execute secure Row-Level Security (RLS) PostgreSQL generation scripts natively tied to Supabase.

---

### ⚙️ Core Architecture Requirements

* **React 19 Server Actions & useActionState:** Forms operate efficiently using fully typed pure server directives (`use server`), reducing overhead, visual bloating, and eliminating heavy client bundles.
* **Pure Edge-Security (Supabase SSR Auth):** Standardized, strict authentication logic in Next.js workflows. Cookie verification natively applied via heavy-lifting server-side validations securely supporting reliable RLS policies.
* **Strict Type-Safety:** 100% full-stack TypeScript safety coverage ranging from the graphical setup pipeline all the way down into deep API client requests routing.

---

### 🛠️ Tech Stack

* **Framework:** Next.js 15+ (React 19, Server Components Router)
* **Auth & Data Layer:** `@supabase/ssr` with direct Edge Middleware mapping
* **Styling Ecosystem:** Tailwind CSS v4
* **Asynchronous Handlers:** Zod Schemas enforcing robust validation pipelines defending workflows inside Server Actions contexts.
* **Client UI standards:** Framer Motion, Radix Primitives

---

### 📂 Repository Structure Guide

```text
mdk/
├── app/                        # Main NextJS App Router directories tree
│   └── (public)/page.tsx       # Polymorphic document frame. Written in-place by Setup CLI!
├── components/                 
│   └── wizard/                 # Visual setup tools dashboard loading on null configured frames
├── lib/
│   ├── actions/                # Verified Identity valid Server Actions endpoints
│   ├── actions/install-module.mjs # High-availability scripts grabbing items asynchronously
│   └── actions/setup-wizard.ts # Main synchronization bridge to remote endpoints
└── .env.example                # Initial configurations layout reference wrapper template
```

---

### 💻 Setup & Startup Instructions

Deployment builds natively off a "Ground-Zero" installation flow.

1. **Clone the repository:**
   ```bash
   git clone [YOUR_REPO_ADDRESS] mdk
   cd mdk
   ```

2. **Install core architecture dependencies:**
   ```bash
   npm install
   ```
   *(Note: third-party modules download automatically via Setup Wizard only if you select them!)*

3. **Autoconfig Env (.env.local):** 
   Do not create files manually! The Visual Installer (Step 6) asks for API nodes and assigns keys to safely generate `.env.local` directly on your disk tree.

4. **Boot and Mutate (Start):**
   ```bash
   npm run dev
   ```
   *Visit `http://localhost:3000`. The interceptor locks the frame and prompts the MDK System Initializer. Godspeed Architect.*

#### 🔁 Installer Reset & Frame Overwrite
When completed, MDK locks installation flags. If you wish to redesign from absolute zero, update colors, or switch visual layout tokens: Simply delete the final JSON hidden `.molenda-setup` checkpoint descriptor file resting in the workspace root, and trigger a local page reload and the Setup dashboard will re-awaken securely!

> Prepared for instant production workflows. The frame protects engineering benchmarks for you natively.

---

---

<a name="polska-dokumentacja"></a>
## 🇵🇱 Polska Dokumentacja

Ewolucja standardowych boilerplate'ów na rynkach zachodnich. **MDK** (Molenda Development Kit) to udostępniony jako open-source, wysoce wyspecjalizowany zestaw deweloperski z wbudowaną architekturą "Self-Configuring Repository". Zamiast zmuszać programistę do układania dziesiątek plików w strukturze manualnie, MDK posiada wbudowany autorski instalator graficzny działający całkowicie w oparciu o środowisko Node.js.

---

### 🚀 Koronna Funkcja: The Setup Interceptor (GUI CLI)

Zanurzyliśmy proces budowania aplikacji webowych (SaaS, Wizytówki) w nowej, wizualnej pętli instalacyjnej. Gdy uruchomisz projekt po raz pierwszy, **Edge Middleware / Layout zablokuje wejście** i uruchomi dla Ciebie graficzny *"Setup Wizard"*.

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

* **Framework:** Next.js 15+ (React 19, Server Components)
* **Weryfikacja danych ciasteczkowych:** `@supabase/ssr` (Edge Middleware)
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
└── .env.example                # Zbiór wymaganych kluczy URL dla wrapperów
```

---

### 💻 Instrukcja Ogniska Startowego

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
