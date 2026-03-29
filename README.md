# ⚡ MDK — Next.js Starter Kit with GUI Setup Wizard

[![CI](https://github.com/marcin2121/mdk/actions/workflows/ci.yml/badge.svg)](https://github.com/marcin2121/mdk/actions/workflows/ci.yml)

> Clone. Run. Configure visually. Ship.

![MDK Setup Wizard Walkthrough](./docs/walkthrough.webp)

MDK (Molenda Development Kit) is an open-source Next.js starter kit that replaces the traditional "clone and manually edit 20 files" workflow with a **built-in visual Setup Wizard**. On first run, Edge Proxy intercepts the request and boots an immersive graphical installer — right in your browser.

No CLI prompts. No YAML configs. Just a beautiful UI that builds your app for you.

---

## 🚀 Quick Start

The fastest way to start is using the **MDK CLI**:

```bash
npx create-mdk my-app
```

**What it does:**
1. Prompts you to pick a template (SaaS, Portfolio, Agency, etc.)
2. Clones the latest MDK core
3. Installs all dependencies
4. Boots the **visual Setup Wizard** at `http://localhost:3000`

---

## ✨ Setup Wizard Features

| Feature | Description |
|---------|-------------|
| **🎨 Visual Theme Editor** | Pick colors, typography, and layout tokens with a live preview iframe powered by React HMR |
| **🤖 AI Copywriting** | Toggle AI generation (Gemini / GPT) to produce SEO titles, hero text, and CTAs for your industry |
| **📦 Module Registry** | Install production-ready components (Chatbot, FAQ, Hero) from `mdk-registry` with **AST automatic injection**. |
| **🔐 Supabase Integration** | Paste your API keys → auto-generates `.env.local` with full SSR auth, RLS policies, and Edge Proxy |
| **📐 Template Selection** | Professional initialization via `npx create-mdk` with curated industry templates |

---

## 🏗️ Built-in Visual Builder

Beyond the Setup Wizard, MDK includes a drag-and-drop page builder at `/builder`:

- **Drag & Drop** — powered by `@dnd-kit`, with nested containers, grids, and flex layouts
- **Style Presets** — Glassmorphism, Neon Glow, Soft Clay, NeoPop — one click
- **Loop / Repeater** — bind arrays to repeat child components dynamically
- **Image & Icon blocks** — upload Base64 images, pick from Lucide icons
- **Code Export** — generates clean `.tsx` files with proper React/Tailwind output
- **Undo/Redo** — full history stack with 50-step limit

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (React 19, App Router, Server Components) |
| Auth & Data | Supabase SSR (`@supabase/ssr`) with Edge Proxy |
| Styling | Tailwind CSS v4 |
| State | Zustand |
| Drag & Drop | `@dnd-kit/core` |
| Animations | Framer Motion |
| Validation | Zod |
| UI Primitives | Radix UI |

---

## 📂 Project Structure

```
mdk/
├── app/
│   ├── builder/page.tsx        # Visual page builder
│   ├── live-preview/page.tsx   # Real-time preview frame
│   └── (public)/page.tsx       # Generated output page
├── components/
│   ├── builder/                # Workspace, Inspector, Sidebar, Layers
│   ├── wizard/                 # Setup Wizard UI
│   └── mdk/                    # Installable modules (Chatbot, FAQ, etc.)
├── lib/
│   ├── actions/                # Server Actions (publish, AI gen, auth)
│   ├── builder/                # Block registry & presets
│   ├── store/                  # Zustand state management
│   └── supabase/               # SSR client, proxy, server utils
└── scripts/                    # Build & patch utilities (`mdk.ts`)
```

---

## 🛠️ MDK CLI Tool

Manage your project after the initial setup with our dedicated CLI:

```bash
# Add a component and inject it into page.tsx automatically using AST
npx mdk add hero-section
```

- **Remote Fetch**: Pulls from `mdk-registry`
- **Dependency Map**: Auto-installs required NPM packages
- **Smart Injection**: Uses `ts-morph` AST to add imports and Jsx tags to your files


---

## 🔁 Resetting the Wizard

After completing setup, remove the `.molenda-setup` file from the project root and reload — the Wizard will reactivate.

---

## 📄 License

MIT — use it, fork it, ship it.

---

**[🇵🇱 Polska wersja dokumentacji →](README.pl.md)**
