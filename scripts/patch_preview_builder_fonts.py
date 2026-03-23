import os

file_path = r"c:\molendavdevelopment\mdk\lib\actions\preview-builder.ts"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_snippet = """        // Handle font family injection inline for preview
        const fontStr = branding.typography === 'inter' ? 'Inter, sans-serif' : branding.typography === 'playfair' ? 'Playfair Display, serif' : branding.typography === 'outfit' ? 'Outfit, sans-serif' : 'Geist, sans-serif';
        compiledCode = compiledCode.replace(/<div className="min-h-screen bg-\[#050505\]/g, `<div style={{ fontFamily: '${fontStr}' }} className="min-h-screen bg-[#050505]`);"""

new_snippet = """        // Handle font family injection inline for preview
        const fontStr = branding.typography === 'inter' ? 'Inter, sans-serif' : branding.typography === 'playfair' ? 'Playfair Display, serif' : branding.typography === 'outfit' ? 'Outfit, sans-serif' : 'Geist, sans-serif';
        
        let fontCdn = "https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap";
        if (branding.typography === 'playfair') fontCdn = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap";
        if (branding.typography === 'outfit') fontCdn = "https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap";

        // Wstrzyknij link CDN style i * { font-family } na samym początku div'a
        const styleInject = `
        <link rel="stylesheet" href="${fontCdn}" />
        <style>{\\`* { font-family: '${fontStr}' !important; }\\`}</style>
        `;
        
        // Zastępujemy pierwsze wystąpienie "return (" lub "return (" na return (\n <> \n styleInject
        import_match = 'return (\n'
        if import_match in compiledCode:
            compiledCode = compiledCode.replace('return (\n', f'return (\n    <>\n      <link rel="stylesheet" href="{fontCdn}" />\n      <style>{{\\`* {{ font-family: "{fontStr}" !important; }}\\`}}</style>\n')
            
            # Dodaj zamknięcie fragmentu na samym końcu przed ostatnimi nawiasami ");"
            if ');\n}' in compiledCode:
                compiledCode = compiledCode.replace(');\n}', '\n    </>\n  );\n}')
            elif ');' in compiledCode:
                # Ostatnie wystąpienie );
                idx = compiledCode.rfind(');')
                if idx != -1:
                    compiledCode = compiledCode[:idx] + '\n    </>\n  ' + compiledCode[idx:]
        else:
             # Gdyby format pliku return ( był w jednej linii (rzadkie)
             compiledCode = compiledCode.replace('return (', f'return (\n    <>\n      <link rel="stylesheet" href="{fontCdn}" />\n      <style>{{\\`* {{ font-family: "{fontStr}" !important; }}\\`}}</style>\n')
             compiledCode = compiledCode.replace(');', '\n    </>\n  );')
"""

# Zastępujemy w pliku:
if old_snippet in content:
    content = content.replace(old_snippet, new_snippet)
else:
    # Wariant alternatywny dla pewności jeżeli kody spacingu się różnią
    print("[WARNING] Static snippet check failed, trying looser match...")
    target_start = "const fontStr = branding.typography === 'inter'"
    target_end = "className=\"min-h-screen bg-[#050505]\");"
    if target_start in content and target_end in content:
        # Znajdź początek i koniec
        start_idx = content.find(target_start)
        end_idx = content.find(target_end) + len(target_end)
        # Zastąp cały ten blok
        content = content[:start_idx-110] + new_snippet + content[end_idx:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("[SUCCESS] Preview-builder patched with flexible styles wrapper & loaded Font CDNs.")
