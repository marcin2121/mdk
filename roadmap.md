# 🗺️ MDK Roadmap

## Pozycjonowanie
**MDK = Najlepszy Next.js Starter Kit z wbudowanym GUI Setup Wizard**
Nie boilerplate. Nie page builder. Starter Kit który się sam konfiguruje przez przeglądarkę.

---

## 🔴 P0 — Warunek wejścia (bez tego 0 gwiazdek)

### 1. Anglicyzacja kodu (1-2 dni)
- Komentarze, zmienne, UI → EN
- README wyłącznie EN (PL jako `README.pl.md`)
- Setup Wizard UI → EN domyślny, PL jako i18n

### 2. Usunięcie Python patch scripts (1 dzień)
- `scripts/*.py` → jeden czysty Node.js CLI lub wyrzucić
- Patch-scripty regexowe = śmierć maintainability

### 3. CI + Testy (1 dzień)
- GitHub Actions: `build` + `lint`
- 3-5 unit testów na builder-store
- Badge ✅ Build Passing w README

### 4. Licencja + CONTRIBUTING.md
- MIT
- Prosty przewodnik kontrybuowania

---

## 🟡 P1 — Core Value (gwiazdki na GitHubie)

### 5. Setup Wizard — full polish (3-5 dni)
Killer feature. Musi być perfekcyjny:
- Wybór szablonu (SaaS / Portfolio / Landing / Dashboard)
- Paleta kolorów (live preview w iframe)
- AI copywriting toggle (Gemini/GPT)
- Supabase keys → auto `.env.local`
- Moduły (Chatbot, Calculator, FAQ) → async npm install
- Efekt WOW: animacje, glass, ciemny motyw

### 6. 5 dopracowanych szablonów (3-5 dni)
- `saas-ai` — Landing + cennik + hero
- `portfolio-dev` — Ciemne portfolio dewelopera
- `agency-creative` — Agencja kreatywna
- `dashboard-admin` — Panel z sidebar
- `ecommerce-minimal` — Sklep z kartami

Każdy na poziomie dribbble, nie WordPress 2018.

### 7. Demo + GIF (1 dzień)
- `mdk.vercel.app` → Setup Wizard na żywo
- GIF 30s w README = jedyny sales pitch który działa
- Video walkthrough na YouTube/X

---

## 🟢 P2 — Skalowanie (po 100+ ⭐)

### 8. CLI: `npx create-mdk my-app`
- Jeden command → clone + install + boot wizard
- Jak `create-next-app`, ale z GUI na localhost

### 9. Plugin System
- `mdk add chatbot` → pobiera z registry, instaluje deps
- Jak `shadcn add`, ale dla pełnych sekcji biznesowych

### 10. Visual Builder jako osobny pakiet `@mdk/builder`
- Oddzielenie od Starter Kita
- Eksport do czystego AST (nie string concatenation)
- Integracja z istniejącymi projektami

---

## Metryka sukcesu

| Milestone | Co musi zadziałać |
|-----------|-------------------|
| 50 ⭐ | Demo na Vercel + GIF w README |
| 200 ⭐ | `npx create-mdk` + 5 szablonów |
| 500 ⭐ | Plugin system + pierwsze community PR |
| 1000 ⭐ | `@mdk/builder` na npm |
