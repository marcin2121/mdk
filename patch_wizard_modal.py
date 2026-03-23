import os

filepath = r"c:\molendavdevelopment\mdk\components\wizard\setup-wizard.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

snippet_to_add = r"""
         {previewUrl && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
               <div className="bg-[#0A0A0A] border-2 border-[#f97316] w-full max-w-6xl h-[85vh] flex flex-col shadow-[0_0_50px_rgba(234,179,8,0.2)] animate-in zoom-in-95">
                  <div className="flex items-center justify-between p-4 border-b border-zinc-900 bg-zinc-900/50">
                     <h3 className="font-bold uppercase tracking-wider text-sm text-[#f97316]">Przegląd Live Componentu</h3>
                     <button onClick={() => setPreviewUrl(null)} className="text-zinc-400 hover:text-white font-black text-xl px-3">&times;</button>
                  </div>
                  <div className="flex-1 w-full bg-white relative">
                     <iframe src={previewUrl} className="w-full h-full border-0" title="Live Preview" />
                  </div>
               </div>
            </div>
         )}
"""

# Znajdź OSTATNIE wystąpienie </div> (zamknięcie głównego diva)
idx = content.rfind("</div>")
if idx != -1:
    # Wstawiamy PRZED ostatnim </div>, czyli wewnątrz głównego kontenera
    content = content[:idx] + "\n" + snippet_to_add + "\n" + content[idx:]
    print("Success with rfind index: ", idx)
else:
    print("Error: </div> not found in file")
    exit(1)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Modal patched via rfind ok")
