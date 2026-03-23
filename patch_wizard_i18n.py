import os

file_path = r"c:\molendavdevelopment\mdk\components\wizard\setup-wizard.tsx"

if not os.path.exists(file_path):
    print("File not found")
    exit(1)

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Wstrzyknięcie importu TRANSLATIONS
if 'import { TRANSLATIONS }' not in content:
    content = content.replace(
        'import { runSetupAction }',
        'import { TRANSLATIONS } from "../../lib/translations"\nimport { runSetupAction }'
    )

# 2. Wstrzyknięcie stanu lang i helpera t() wewnątrz SetupWizard()
# Wstawimy go bezpośrednio po pierwszym useState
if 'const [lang, setLang]' not in content:
    content = content.replace(
        'const [step, setStep] = useState(1)',
        'const [step, setStep] = useState(1)\n  const [lang, setLang] = useState<"pl" | "en">("pl")\n  const t = (key: string) => TRANSLATIONS[lang][key] || key'
    )

# 3. Zmodyfikowanie stałych PROJECT_TYPES, TEMPLATES, OPTIONAL_PACKAGES aby brały klucze
content = content.replace("'SaaS Platforma'", "'saas_name'")
content = content.replace("'Aplikacje B2B, modele subskrypcyjne (Stripe), analityka i monetyzacja API.'", "'saas_desc'")
content = content.replace("'Wizytówka (MŚP)'", "'client_name'")
content = content.replace("'Szybkie i potężnie konwertujące strony dla firm usługowych i lokalnych.'", "'client_desc'")
content = content.replace("'Agencja / Portfolio'", "'portfolio_name'")
content = content.replace("'Kreatywne i silnie animowane wizje wizytówkowe z wariantami Premium 3D.'", "'portfolio_desc'")

# PACKAGE_CATEGORIES
content = content.replace("{ id: 'all', name: 'Wszystkie' }", "{ id: 'all', name: t('cat_all') }")
content = content.replace("{ id: 'dev', name: 'DevOps & Narzędzia' }", "{ id: 'dev', name: t('cat_dev') }")
content = content.replace("{ id: 'db', name: 'Bazy i ORM' }", "{ id: 'db', name: t('cat_db') }")
content = content.replace("{ id: 'state', name: 'Stan & Dane' }", "{ id: 'state', name: t('cat_state') }")
content = content.replace("{ id: 'auth', name: 'Autoryzacja' }", "{ id: 'auth', name: t('cat_auth') }")
content = content.replace("{ id: 'ui', name: 'UI & Animacje' }", "{ id: 'ui', name: t('cat_ui') }")
content = content.replace("{ id: 'api', name: 'API & SaaS' }", "{ id: 'api', name: t('cat_api') }")

# 4. Zmiana wykorzystania w .map()
content = content.replace('{type.name}', '{t(type.name)}')
content = content.replace('{type.desc}', '{t(type.desc)}')
content = content.replace('{tmpl.name}', '{t(tmpl.name) === tmpl.name ? tmpl.name : t(tmpl.name)}')
content = content.replace('{tmpl.desc}', '{t(tmpl.desc) === tmpl.desc ? tmpl.desc : t(tmpl.desc)}')

# 5. Przetłumaczenie Step JSX (Zamiana statycznych tekstów na t())
replacements = {
    # Step headers/desc
    '>Określ Wektor Biznesowy (Krok 1)<': ">{t('step1_title')}<",
    '>Wybierz Moduł UI (Krok 2)<': ">{t('step2_title')}<",
    '>Architektura Biznesowa & AI<': ">{t('step3_title')}<",
    '>Skonfiguruj kontakt, zautomatyzowany copywriting sztucznej inteligencji oraz wbudowaną bazę danych w jednym kroku.<': ">{t('step3_desc')}<",
    '>Wizualny Kreator i Edytor Treści (Krok 4)<': ">{t('step4_title')}<",
    '>Środowisko API (.env.local) (Krok 6)<': ">{t('step6_title')}<",
    '>Finałowa Kompilacja<': ">{t('final_build')}<",
    
    # Buttons & Small Labels
    '>Wróć<': ">{t('back')}<",
    '>Dalej<': ">{t('next')}<",
    'Analiza AI w toku...': "{t('analyzing')}",
    'Analiza AI w toku...': "Analiza AI w toku...", # wait, let's fix
    'Analiza AI w toku...': "Analiza AI w toku...",
    
    # Step 3 Labels
    '>Metadane Kontaktowe<': ">{t('contact_metadata')}<",
    '>Numer Telefonu<': ">{t('phone')}<",
    '>Adres E-mail<': ">{t('email')}<",
    '>Pełny Adres Siedziby<': ">{t('address')}<",
    '>Tracking ID (GA4/Pixel)<': ">{t('analytics_id')}<",
    '>AI SEO Wtrysk<': ">{t('ai_injection')}<",
    '>Wygenereuj inteligentny copywriting do bazy źródłowej.<': ">{t('ai_injection_desc')}<",
    '>Klucz dostępu (AI API KEY)<': ">{t('ai_key')}<",
    '>Branża SEO (Słowa Kluczowe)<': ">{t('seo_keywords')}<",
    '>Dodatkowy Tone of Voice<': ">{t('tone')}<",
    '>Inny Zespół Backendowy (MDK Architektura)<': ">{t('other_backend')}<",
    '>Inżynieria Supabase (SQL Builder)<': ">{t('supabase_name')}<",
    '>LLM dopisze gotowe migracje bazy relacyjnej SQL pod twoją branżę. ': ">{t('supabase_desc')} ",
    '>Globalne CSS (Tailwind Injector)<': ">{t('tailwind_vars_name')}<",
    '>Zastąp inline styles globalnymi klasami Tailwind.<': ">{t('tailwind_vars_desc')}<",
    '>Generatywna Topologia Zagnieżdżeń<': ">{t('topology_name')}<",
    '>AI dopisze ci 2 potężne gotowe, fizyczne podstrony URL do projektu z route group! ': ">{t('bias_topol')} ",
    '(Wymaga AI)': "{t('requires_ai')}",
    'Dalej: Wizualny Kreator (4)': "{t('visual_builder_btn')}",
    '✨ Zezwól AI na Copywriting & Kontynuuj': "{t('ai_proceed')}",

    # Step 4 Visual Builder
    '>Visual <br/>Builder<': ">{t('visual_builder')}<",
    '>Podejmuj decyzje wizualne na żywo. Pełen pogląd.<': ">{t('visual_builder_desc')}<",
    '>Główne LOGO (Tekst)<': ">{t('logo_text')}<",
    '>Kolor Przewodni (HEX)<': ">{t('primary_color')}<",
    '>Edytor Treści & Odnośników<': ">{t('content_editor')}<",
    '>Główny Nagłówek (Hero Title)<': ">{t('hero_title_editor')}<",
    '>Opis Poboczny (Hero Desc)<': ">{t('hero_desc_editor')}<",
    '>Profil Typografii<': ">{t('typography')}<",
    '>Styl Navbara<': ">{t('navbar_style')}<",
    '>Styl Stopki<': ">{t('footer_style')}<",
    'Sklep Modułów (Premium MDK)': "{t('premium_modules')}",
    'Pobieranie...': "{t('downloading')}",
    'Dalej: Narzędzia (5)': "{t('goto_packages_btn')}",
    '>Trwa kompilacja HMR...<': ">{t('live_preview_loading')}<",

    # Step 5
    '>Narzędzia Deweloperskie<': ">{t('step5_title')}<",
    '>Zaznacz dodatkowe pakiety, które zostaną zainstalowane i skonfigurowane na dysku.<': ">{t('step5_desc')}<",
    'Dalej: .env.local (Krok 6)': "{t('goto_env_btn')}",

    # Step 6
    '>Środowisko API (.env.local)<': ">{t('step6_title')}<",
    '>Ułatwienie dla deweloperów. Wklej tutaj klucze do Supabase, a instalator automatycznie wygeneruje chroniony plik .env.local na Twoim dysku ułatwiając całą pracę z plikami ukrytymi.<': ">{t('step6_desc')}<",
    'Wygeneruj Pełną Aplikację (Zakończ)': "{t('final_submit_btn')}",

    # Step 7
    '>Finałowa Kompilacja<': ">{t('final_build')}<",
    'Node.js oczekuje na komendę wstrzyknięcia...': "{t('wait_script')}",
    'URUCHOM SKRYPT GENERATORA': "{t('run_generator_btn')}",
    'WRÓĆ I POPRAW KONFIGURACJĘ API (KROK 6)': "{t('fix_config_btn')}"
}

for src, dest in replacements.items():
    content = content.replace(src, dest)

# 6. Dodanie przełącznika języka obok "Daj gwiazdkę"
language_switch = """<div className="flex border border-zinc-800 bg-[#0A0A0A] p-0.5">
                  <button onClick={() => setLang('pl')} className={`px-2 py-1 text-[10px] font-bold ${lang === 'pl' ? 'bg-[#f97316] text-black' : 'text-zinc-500 hover:text-white'}`}>PL</button>
                  <button onClick={() => setLang('en')} className={`px-2 py-1 text-[10px] font-bold ${lang === 'en' ? 'bg-[#f97316] text-black' : 'text-zinc-500 hover:text-white'}`}>EN</button>
               </div>"""

if '<div className="flex border border-zinc-800' not in content:
    content = content.replace(
        '</a>',
        f'</a>\n               {language_switch}'
    )

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("[SUCCESS] Setup Wizard updated with i18n switches.")
