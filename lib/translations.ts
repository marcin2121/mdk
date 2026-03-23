export const TRANSLATIONS: Record<string, Record<string, string>> = {
  pl: {
     // Global/Layout
     title_mdk: "MDK",
     title_desc: "(Molenda Development Kit)",
     initializer: "MDK System Initializer",
     star_mdk: "Daj gwiazdkę",
     back: "Wróć",
     next: "Dalej",
     analyzing: "Analiza AI w toku...",
     ai_proceed: "✨ Zezwól AI na Copywriting & Kontynuuj",
     generating: "Mielenie surowego kodu źródłowego na dysku...",
     run_generator_btn: "URUCHOM SKRYPT GENERATORA",
     fix_config_btn: "WRÓĆ I POPRAW KONFIGURACJĘ API (KROK 6)",

     // Step 1
     step1_title: "Określ Wektor Biznesowy (Krok 1)",
     saas_name: "SaaS Platforma",
     saas_desc: "Aplikacje B2B, modele subskrypcyjne (Stripe), analityka i monetyzacja API.",
     client_name: "Wizytówka (MŚP)",
     client_desc: "Szybkie i potężnie konwertujące strony dla firm usługowych i lokalnych.",
     portfolio_name: "Agencja / Portfolio",
     portfolio_desc: "Kreatywne i silnie animowane wizje wizytówkowe z wariantami Premium 3D.",

     // Step 2
     step2_title: "Wybierz Moduł UI (Krok 2)",

     // Step 3
     step3_title: "Architektura Biznesowa & AI",
     step3_desc: "Skonfiguruj kontakt, zautomatyzowany copywriting sztucznej inteligencji oraz wbudowaną bazę danych w jednym kroku.",
     contact_metadata: "Metadane Kontaktowe",
     phone: "Numer Telefonu",
     email: "Adres E-mail",
     address: "Pełny Adres Siedziby",
     analytics_id: "Tracking ID (GA4/Pixel)",
     ai_injection: "AI SEO Wtrysk",
     ai_injection_desc: "Wygenereuj inteligentny copywriting do bazy źródłowej.",
     ai_key: "Klucz dostępu (AI API KEY)",
     seo_keywords: "Branża SEO (Słowa Kluczowe)",
     tone: "Dodatkowy Tone of Voice",
     other_backend: "Inny Zespół Backendowy (MDK Architektura)",
     supabase_name: "Inżynieria Supabase (SQL Builder)",
     supabase_desc: "LLM dopisze gotowe migracje bazy relacyjnej SQL pod twoją branżę.",
     tailwind_vars_name: "Globalne CSS (Tailwind Injector)",
     tailwind_vars_desc: "Zastąp inline styles globalnymi klasami Tailwind.",
     topology_name: "Generatywna Topologia Zagnieżdżeń",
     topology_desc: "AI dopisze ci 2 potężne gotowe, fizyczne podstrony URL do projektu z route group!",
     requires_ai: "(Wymaga AI)",
     visual_builder_btn: "Dalej: Wizualny Kreator (4)",

     // Step 4 (Visual Builder)
     visual_builder: "Visual Builder",
     visual_builder_desc: "Podejmuj decyzje wizualne na żywo. Pełen pogląd.",
     logo_text: "Główne LOGO (Tekst)",
     cta_btn_text: "Tekst Przycisku CTA",
     hero_image: "URL Obrazka (Hero)",
     primary_color: "Kolor Przewodni (HEX)",
     content_editor: "Edytor Treści & Odnośników",
     hero_title_editor: "Główny Nagłówek (Hero Title)",
     hero_desc_editor: "Opis Poboczny (Hero Desc)",
     typography: "Profil Typografii",
     navbar_style: "Styl Navbara",
     footer_style: "Styl Stopki",
     premium_modules: "Sklep Modułów (Premium MDK)",
     chatbot_name: "Chatbot AI B2B",
     calculator_name: "Kalkulator B2B",
     testimonials_name: "Karuzela Opinii",
     pricing_name: "Plany Abonamentowe",
     faq_name: "Zwijane Sekcje (FAQ)",
     chatbot_prompt: "Instrukcja systemowa Bota (Prompt Systemowy B2B)",
     downloading: "Pobieranie...",
     goto_packages_btn: "Dalej: Narzędzia (5)",
     live_preview_loading: "Trwa kompilacja HMR...",

     // Step 5 (Packages)
     step5_title: "Narzędzia Deweloperskie",
     step5_desc: "Zaznacz dodatkowe pakiety, które zostaną zainstalowane i skonfigurowane na dysku.",
     goto_env_btn: "Dalej: .env.local (Krok 6)",

     // Package Categories
     cat_all: "Wszystkie",
     cat_dev: "DevOps & Narzędzia",
     cat_db: "Bazy i ORM",
     cat_state: "Stan & Dane",
     cat_auth: "Autoryzacja",
     cat_ui: "UI & Animacje",
     cat_api: "API & SaaS",

     // Step 6 (Env)
     step6_title: "Środowisko API (.env.local)",
     step6_desc: "Ułatwienie dla deweloperów. Wklej tutaj klucze do Supabase, a instalator automatycznie wygeneruje chroniony plik .env.local na Twoim dysku ułatwiając całą pracę z plikami ukrytymi.",
     final_submit_btn: "Wygeneruj Pełną Aplikację (Zakończ)",

     // Step 7 (Final)
     final_build: "Finałowa Kompilacja",
     wait_script: "Node.js oczekuje na komendę wstrzyknięcia..."
  },
  en: {
     // Global/Layout
     title_mdk: "MDK",
     title_desc: "(Molenda Development Kit)",
     initializer: "MDK System Initializer",
     star_mdk: "Star MDK on GitHub",
     back: "Back",
     next: "Next",
     analyzing: "AI Analysis in progress...",
     ai_proceed: "✨ Allow AI Copywriting & Continue",
     generating: "Compiling raw source code on disk...",
     run_generator_btn: "RUN GENERATOR SCRIPT",
     fix_config_btn: "BACK AND FIX API CONFIG (STEP 6)",

     // Step 1
     step1_title: "Determine Business Vector (Step 1)",
     saas_name: "SaaS Platform",
     saas_desc: "B2B applications, subscription models (Stripe), analytics, and API monetization.",
     client_name: "Client Showcase (SME)",
     client_desc: "Fast and high-converting pages for service and local businesses.",
     portfolio_name: "Agency / Portfolio",
     portfolio_desc: "Creative and highly animated portfolio visions with Premium 3D variants.",

     // Step 2
     step2_title: "Select UI Module (Step 2)",

     // Step 3
     step3_title: "Business Architecture & AI",
     step3_desc: "Configure contact information, automated AI copywriting, and embedded database in one step.",
     contact_metadata: "Contact Metadata",
     phone: "Phone Number",
     email: "E-mail Address",
     address: "Full Headquarters Address",
     analytics_id: "Tracking ID (GA4/Pixel)",
     ai_injection: "AI SEO Injection",
     ai_injection_desc: "Generate intelligent copywriting into the source base.",
     ai_key: "Access Key (AI API KEY)",
     seo_keywords: "SEO Industry (Keywords)",
     tone: "Additional Tone of Voice",
     other_backend: "Alternative Backend Pack (MDK Architecture)",
     supabase_name: "Supabase Engineering (SQL Builder)",
     supabase_desc: "LLM will generate ready-to-run SQL relational database migrations for your niche.",
     tailwind_vars_name: "Global CSS (Tailwind Injector)",
     tailwind_vars_desc: "Replace inline styles with global Tailwind classes.",
     topology_name: "Generative Nested Topology",
     topology_desc: "AI will generate 2 robust, physical URL subpages for nested Route Groups!",
     requires_ai: "(Requires AI)",
     visual_builder_btn: "Next: Visual Builder (4)",

     // Step 4 (Visual Builder)
     visual_builder: "Visual Builder",
     visual_builder_desc: "Make visual decisions live. Full immersive preview.",
     logo_text: "Main LOGO (Text)",
     cta_btn_text: "CTA Button Text",
     hero_image: "Hero Image URL",
     primary_color: "Primary Color (HEX)",
     content_editor: "Content & Links Editor",
     hero_title_editor: "Main Heading (Hero Title)",
     hero_desc_editor: "Sub-Description (Hero Desc)",
     typography: "Typography Profile",
     navbar_style: "Navbar Style",
     footer_style: "Footer Style",
     premium_modules: "Module Marketplace (Premium MDK)",
     chatbot_name: "B2B AI Chatbot",
     calculator_name: "B2B Cost Estimator",
     testimonials_name: "Testimonials Slider",
     pricing_name: "Subscription Plans",
     faq_name: "Accordion (FAQ)",
     chatbot_prompt: "Bot System Prompt (B2B Prompting Guidelines)",
     downloading: "Downloading...",
     goto_packages_btn: "Next: Packages (5)",
     live_preview_loading: "HMR Compiling...",

     // Step 5 (Packages)
     step5_title: "Developer Packages",
     step5_desc: "Check off additional software dependencies that will be installed on disk tree.",
     goto_env_btn: "Next: .env.local (Step 6)",

     // Package Categories
     cat_all: "All",
     cat_dev: "Devops & Tooling",
     cat_db: "Databases & ORM",
     cat_state: "State & Data",
     cat_auth: "Authentification",
     cat_ui: "UI & Animations",
     cat_api: "API & SaaS",

     // Step 6 (Env)
     step6_title: "API Environment Variables (.env.local)",
     step6_desc: "Friendly developer workflow. Paste your Supabase keys here, and the installer automatically writes a protected file to prevent workflow bloating.",
     final_submit_btn: "Generate Full Application (Finish)",

     // Step 7 (Final)
     final_build: "Final Compile & Build",
     wait_script: "NodeJS is awaiting server directive execution trigger..."
  }
}
