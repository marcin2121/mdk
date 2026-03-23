import os

filepath = r"c:\molendavdevelopment\mdk\lib\actions\setup-wizard.ts"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

anchor = "// 4.6. WSTRZYKIWANIE TYPOGRAFII I ANALITYKI DO layout.tsx"

code_to_insert = r"""
     if (config.branding.modules?.pricing) {
        console.log(`[MDK SYSTEM] Pobieranie Modułu Pricing ze zdalnego repozytorium...`);
        const componentsDir = path.join(process.cwd(), 'components', 'mdk');
        if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });
        
        let pricingCode = "";
        try {
            const res = await fetch(`${MDK_REGISTRY_URL}/pricing-cards.txt`);
            if (res.ok) pricingCode = await res.text();
            else throw new Error("Fetch failed");
        } catch (err) {
            try { pricingCode = fs.readFileSync(path.join(process.cwd(), '..', 'mdk-registry', 'components', 'pricing-cards.txt'), 'utf-8'); } catch { pricingCode = `export default function PricingCrash() { return <div>Brak komponentu Pricing.</div> }`; }
        }

        const meta = parseMdkMetadata(pricingCode);
        if (meta.dependencies?.length > 0) {
            try { await execAsync(`npm install ${meta.dependencies.join(' ')}`); } catch {}
        }
        pricingCode = pricingCode.replace(/\/\* MDK-METADATA[\s\S]*?\*\//, '').trim();

        fs.writeFileSync(path.join(componentsDir, 'Pricing.tsx'), pricingCode);
        appendedImports += `import Pricing from '@/components/mdk/Pricing';\n`;
        appendedComponents += `\n            {/* Wstrzykiwany Moduł Cennika */}\n            <Pricing />\n`;
     }

     if (config.branding.modules?.faq) {
        console.log(`[MDK SYSTEM] Pobieranie Modułu FAQ ze zdalnego repozytorium...`);
        const componentsDir = path.join(process.cwd(), 'components', 'mdk');
        if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });
        
        let faqCode = "";
        try {
            const res = await fetch(`${MDK_REGISTRY_URL}/accordion-faq.txt`);
            if (res.ok) faqCode = await res.text();
            else throw new Error("Fetch failed");
        } catch (err) {
            try { faqCode = fs.readFileSync(path.join(process.cwd(), '..', 'mdk-registry', 'components', 'accordion-faq.txt'), 'utf-8'); } catch { faqCode = `export default function FAQCrash() { return <div>Brak komponentu FAQ.</div> }`; }
        }

        const meta = parseMdkMetadata(faqCode);
        if (meta.dependencies?.length > 0) {
            try { await execAsync(`npm install ${meta.dependencies.join(' ')}`); } catch {}
        }
        faqCode = faqCode.replace(/\/\* MDK-METADATA[\s\S]*?\*\//, '').trim();

        fs.writeFileSync(path.join(componentsDir, 'AccordionFAQ.tsx'), faqCode);
        appendedImports += `import AccordionFAQ from '@/components/mdk/AccordionFAQ';\n`;
        appendedComponents += `\n            {/* Wstrzykiwana Sekcja FAQ */}\n            <AccordionFAQ />\n`;
     }
"""

if anchor in content:
    content = content.replace(anchor, code_to_insert + "\n    " + anchor)
    print("Success with anchor")
else:
    print("Anchor not found")
    exit(1)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Success final anchor")
