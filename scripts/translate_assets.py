import os

components_dir = r"c:\molendavdevelopment\mdk\components\mdk"
templates_dir = r"c:\molendavdevelopment\mdk-registry\templates"

# --- 1. KOMPONENTY TSX ---
for filename in os.listdir(components_dir):
    if not filename.endswith('.tsx'): continue
    path = os.path.join(components_dir, filename)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Dodaj flagę isEn pod importami
    if 'const isEn = typeof window' not in content:
        content = content.replace('"use client"\n', '"use client"\nconst isEn = typeof window !== "undefined" && window.location.href.includes("/en");\n')
        content = content.replace('"use client";\n', '"use client"\nconst isEn = typeof window !== "undefined" && window.location.href.includes("/en");\n')

    # Zamień teksty w Calculator
    if filename == 'Calculator.tsx':
        content = content.replace('Estymator Kosztów Projektu', '{isEn ? "Project Cost Estimator" : "Estymator Kosztów Projektu"}')
        content = content.replace('Skala Zamówienia / Ilość Jednostek', '{isEn ? "Order Scale / Number of Units" : "Skala Zamówienia / Ilość Jednostek"}')
        content = content.replace('jednostek roboczych', '{isEn ? "working units" : "jednostek roboczych"}')
        content = content.replace('Szacowany Koszt Systemowy:', '{isEn ? "Estimated System Cost:" : "Szacowany Koszt Systemowy:"}')

    # Zamień teksty w Chatbot
    elif filename == 'Chatbot.tsx':
        content = content.replace('Witaj! Jestem automatycznym doradcą i inżynierem ofert.', '{isEn ? "Hello! I am an automatic advisor and quote engineer." : "Witaj! Jestem automatycznym doradcą i inżynierem ofert."}')
        content = content.replace('W czym mogę pomoc?', '{isEn ? "How can I help you?" : "W czym mogę pomoc?"}')
        content = content.replace('placeholder="Wpisz zapytanie..."', 'placeholder={isEn ? "Type your query..." : "Wpisz zapytanie..."}')

    # Zamień teksty w Pricing
    elif filename == 'Pricing.tsx':
        content = content.replace('Plany <span className="text-[var(--mdk-primary)]">Abonamentowe</span>', '{isEn ? "Subscription " : "Plany "}<span className="text-[var(--mdk-primary)]">{isEn ? "Plans" : "Abonamentowe"}</span>')
        content = content.replace('Przejrzyste warunki, zero ukrytych kosztów. Skaluj od zera do sukcesu.', '{isEn ? "Transparent terms, zero hidden costs. Scale from zero to success." : "Przejrzyste warunki, zero ukrytych kosztów. Skaluj od zera do sukcesu."}')
        content = content.replace('Polecany', '{isEn ? "Popular" : "Polecany"}')
        content = content.replace('/ mies.', '{isEn ? "/ mo." : "/ mies."}')
        content = content.replace('Wybierz Plan', '{isEn ? "Choose Plan" : "Wybierz Plan"}')
        content = content.replace('"Starter", price: "49", desc: "Zbuduj i wypuść swoje pierwsze MVP.", features: ["1 projekt", "Podstawowe UI", "Wsparcie 24/7", "Domena .pl"]', '"Starter", price: "49", desc: isEn ? "Build and launch your first MVP." : "Zbuduj i wypuść swoje pierwsze MVP.", features: isEn ? ["1 project", "Basic UI", "24/7 Support", "Domain included"] : ["1 projekt", "Podstawowe UI", "Wsparcie 24/7", "Domena .pl"]')
        content = content.replace('"Pro", price: "129", desc: "Zwiększ skalę i dodaj automatyzacje.", features: ["5 projektów", "Klocki Premium MDK", "Dedykowana analityka", "Aplikacja mobilna"]', '"Pro", price: "129", desc: isEn ? "Scale up and add automations." : "Zwiększ skalę i dodaj automatyzacje.", features: isEn ? ["5 projects", "MDK Premium Nodes", "Dedicated Analytics", "Mobile App"] : ["5 projektów", "Klocki Premium MDK", "Dedykowana analityka", "Aplikacja mobilna"]')
        content = content.replace('"Enterprise", price: "399", desc: "Dla korporacji i skalowalnych systemów.", features: ["Nielimitowana ilość", "Serwer dedykowany", "SLA 99.9%", "Rozliczenia B2B"]', '"Enterprise", price: "399", desc: isEn ? "For corporations and scalable systems." : "Dla korporacji i skalowalnych systemów.", features: isEn ? ["Unlimited amount", "Dedicated server", "SLA 99.9%", "B2B Billing"] : ["Nielimitowana ilość", "Serwer dedykowany", "SLA 99.9%", "Rozliczenia B2B"]')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# --- 2. TEMPLATKI TXT -> DUBLOWANIE -en.txt ---
for filename in os.listdir(templates_dir):
    if not filename.endswith('.txt') or filename.endswith('-en.txt'): continue
    path = os.path.join(templates_dir, filename)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    en_content = content
    if filename == 'saas-ai.txt':
        en_content = en_content.replace('Statystyki w Czasie Rzeczywistym', 'Real-time Statistics')
        en_content = en_content.replace('Błyskawiczna integracja z bazą danych PostgreSQL. Zero opóźnień.', 'Lightning-fast integration with PostgreSQL database. Zero lag.')
        en_content = en_content.replace('Role & Uprawnienia', 'Roles & Permissions')
        en_content = en_content.replace('Bezwzględne bezpieczeństwo rzędów dzięki natywnym politykom RLS.', 'Absolute row-level security with native RLS policies.')
        en_content = en_content.replace('Prędkość Edge', 'Edge Speed')
        en_content = en_content.replace('Aplikacja renderowana bezpośrednio na węzłach Vercel dlla 100/100 LH.', 'Apps rendered directly on Vercel Edge nodes.')
        en_content = en_content.replace('System Gotowy', 'System Ready')
        en_content = en_content.replace('Dokumentacja', 'Documentation')
        en_content = en_content.replace('Cennik', 'Pricing')
        en_content = en_content.replace('Logowanie', 'Sign In')

    elif filename == 'client-beauty.txt':
        en_content = en_content.replace('Solidne Fundamenty', 'Solid Foundations')
        en_content = en_content.replace('Dlaczego warto nam zaufać?', 'Why trust us?')
        en_content = en_content.replace('Każdy projekt traktujemy z najwyższym rygorem jakościowym.', 'We treat every project with highest quality rigor.')
        en_content = en_content.replace('Wszystkie ikony w jednym miejscu.', 'All icons in one place.')
        en_content = en_content.replace('Siedziba Główna', 'Headquarters')
        en_content = en_content.replace('Linia Otwarta', 'Open Line')
        en_content = en_content.replace('Dostępność Usług', 'Service Availability')
        en_content = en_content.replace('Poniedziałek - Piątek', 'Monday - Friday')
        en_content = en_content.replace('Usługi', 'Services')
        en_content = en_content.replace('Lokalizacja', 'Location')
        en_content = en_content.replace('Twój Biznes <br/><span style={{ color: \'{{PRIMARY_COLOR}}\' }}>Na Zasięgu Ręki.</span>', 'Your Business <br/><span style={{ color: \'{{PRIMARY_COLOR}}\' }}>At Your Fingertips.</span>')

    out_en_path = os.path.join(templates_dir, filename.replace('.txt', '-en.txt'))
    with open(out_en_path, 'w', encoding='utf-8') as f:
        f.write(en_content)

print("[SUCCESS] All templates multiplied to -en.txt and components fully patched with isEn inline conditions.")
