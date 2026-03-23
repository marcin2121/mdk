"use server"

export async function generateCopywriting(branding: any) {
    if (!branding.aiKey) {
        return { error: 'Brak klucza API.' };
    }

    try {
        const isEn = branding.lang === 'en';
        
        const prompt = isEn ? `
You are an elite copywriter for an Awwwards-winning interactive agency.
Here is the company context:
Name: ${branding.companyName || 'Startup'}
Niche/Keywords: ${branding.seoKeywords || 'Technology, Modern'}
Tone of Voice: ${branding.aiContext || 'Professional, direct'}

Generate a heroTitle (Hero Heading), a heroDesc (Sub-headline), and a ctaText (Button label) for the main landing page section.
Important! Do NOT add Markdown tags like \`\`\`json. Just output the raw object. Return data in clean, minimal JSON structure.
Example structure: { "heroTitle": "Aggressive Headline With Class", "heroDesc": "Trust industry experts, not amateurs.", "ctaText": "Get Started" }
Use up to 4-5 words max in Title, and up to 15 words in Desc.
` : `
Jesteś elitarnym copywriterem agencji interaktywnej nagradzanej Awwwards.
Oto kontekst firmy:
Nazwa: ${branding.companyName || 'Startup'}
Branża/Słowa kluczowe: ${branding.seoKeywords || 'Technologia, Nowoczesność'}
Ton głosu (Tone of Voice): ${branding.aiContext || 'Profesjonalny, bezpośredni'}

Wygeneruj nagłówek (Hero Title) oraz mniejszy tekst poboczny (Hero Description) dla głównej sekcji strony lądowania.
Pamiętaj! Nie dodawaj kodowania Markdown \`\`\`json. Po prostu wypluj sam obiekt. Zwróć dane w czystym minimalnym formacie JSON o odpowiedniej strukturze.
Przykład struktury: { "heroTitle": "Agresywny Nagłówek Z Klasą", "heroDesc": "Zaufaj ludziom z branży, a nie amatorom", "ctaText": "Zaczynamy" }
Użyj do 4-5 słów max w Title, i do 15 słów w Desc.
`;

        let extractedJsonText = "";

        if (branding.aiProvider === 'gemini' || branding.aiProvider === 'openai') {
            const endpoint = branding.aiProvider === 'gemini' 
                ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${branding.aiKey}`
                : `https://api.openai.com/v1/chat/completions`;

            const payloadGemini = {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json" }
            };

            const payloadOpenAI = {
                model: branding.aiModel || "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            };

            const aiRes = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(branding.aiProvider === 'openai' && {'Authorization': `Bearer ${branding.aiKey}`})},
                body: JSON.stringify(branding.aiProvider === 'gemini' ? payloadGemini : payloadOpenAI)
            });

            if (!aiRes.ok) throw new Error("API Connection Failed");

            const data = await aiRes.json();
            if (branding.aiProvider === 'gemini' && data.candidates) {
                extractedJsonText = data.candidates[0].content.parts[0].text;
            } else if (branding.aiProvider === 'openai' && data.choices) {
                extractedJsonText = data.choices[0].message.content;
            }

        } else if (branding.aiProvider === 'claude') {
            // Claude Implementation
            const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-api-key': branding.aiKey,
                    'anthropic-version': '2023-06-01',
                    'anthropic-dangerously-allow-browser': 'true'
                },
                body: JSON.stringify({
                    model: branding.aiModel || "claude-3-5-sonnet-20241022",
                    max_tokens: 1000,
                    messages: [{ role: "user", content: prompt }]
                })
            });
            if (!aiRes.ok) throw new Error("API Connection Failed");
            const data = await aiRes.json();
            extractedJsonText = data.content[0].text;
        }

        if (extractedJsonText) {
            const cleanJsonStr = extractedJsonText.replace(/```json/g, '').replace(/```/g, '').trim();
            const aiResult = JSON.parse(cleanJsonStr);
            return {
                heroTitle: aiResult.heroTitle,
                heroDesc: aiResult.heroDesc,
                ctaText: aiResult.ctaText
            };
        }
        return { error: 'Empty generation.' };
    } catch(e: any) {
        return { error: e.message };
    }
}
