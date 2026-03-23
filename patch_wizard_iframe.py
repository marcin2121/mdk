import os

filepath = r"c:\molendavdevelopment\mdk\components\wizard\setup-wizard.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Dodajemy import generateLivePreview
import_start = 'import { runSetupAction } from "../../lib/actions/setup-wizard"'
if import_start in content:
    content = content.replace(import_start, import_start + '\nimport { generateLivePreview } from "../../lib/actions/preview-builder"\nimport { useEffect } from "react"')

# 2. Dodajemy stan dla timestampa i useEffect uderzający w serwer akcję
effect_code = r"""
  const [livePreviewTimestamp, setLivePreviewTimestamp] = useState(Date.now());

  useEffect(() => {
     if(step !== 3) return;
     const timer = setTimeout(async () => {
         const res = await generateLivePreview(selectedTemplate || 'saas-ai', branding);
         if(res?.timestamp) {
             // Nie zmieniamy klucza Iframe żeby Next.js Hot Reload zadziałał gładko przez stelaż!
             console.log('[MDK Live Preview] Nowy build hmr zrzucony do /live-preview');
         }
     }, 1000);
     return () => clearTimeout(timer);
  }, [branding, step, selectedTemplate]);
"""
state_anchor = "const [logs, setLogs] = useState<string[]>([])"
if state_anchor in content:
    content = content.replace(state_anchor, state_anchor + "\n" + effect_code)

# 3. Zastępujemy makietę DIV fizycznym IFRAME
iframe_div = r"""
                           {/* MDK FAST REFRESH SERVER OVERLAY */}
                           <iframe src="/live-preview" className="w-full h-full border-0 absolute inset-0 z-10" />
                           <div className="absolute inset-0 flex items-center justify-center -z-10"><Loader2 className="animate-spin text-zinc-500" /></div>
"""

# musimy zastąpić starą zawartość od {/* Navbar Mock */} w dół do </div>
mock_start = "{/* Navbar Mock */}"
mock_end = "{/* Footer Mock */}"

idx_start = content.find(mock_start)
idx_end = content.find("</div>", content.find(mock_end)) + 6 # find the closing div of footer mock

if idx_start != -1 and idx_end != -1:
    content = content[:idx_start] + iframe_div + content[content.find("</div>", content.find("</div>", content.find("</div>", content.find(mock_end)))) + 6:]
    # basically just stripping everything inside the preview container and throwing iframe.
    # Actually, simpler: Let's split using known bounds.

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Setup updated partially. Re-patching Iframe bounds...")
