# 🔮 MDK Visual Builder (Elementor-style for React)
## Koncepcja i Architektura Przyszłościowa

Wizja zrobienia "Elementor dla kodu React" to dla środowiska Next.js krok milowy. Tradycyjne kreatory WordPress generują ciężki kod HTML/CSS w bazach danych, podczas gdy MDK ma przewagę: **może generować czysty, modularny i rygorystyczny statyczny kod React/Tailwind**, wolny od narzutu DOM (Overhead).

Oto proponowana **Architektura Systemowa (Mesh)** do wdrożenia takiego modułu:

---

### 🧱 1. State Canvas Architecture (Model Danych)
Trzonem edytora wizualnego jest **JSON Node Tree (Canvas State)**. Każda sekcja na ekranie musi być opisana deklaratywnie:

```json
{
  "id": "root_canvas",
  "type": "Page",
  "children": [
    {
      "id": "nav_123",
      "type": "Navbar",
      "props": { "style": "glass", "position": "sticky" }
    },
    {
      "id": "hero_456",
      "type": "Hero",
      "props": { 
        "title": "Twój Biznes", 
        "primaryColor": "#f97316" 
      }
    }
  ]
}
```
*   **Zaleta**: Stan ten żyje w React Context (lub Jotai/Zustand) na froncie instalatora i jest bezpośrednio serializowany.

---

### 🖐️ 2. Komponenty i Mechaniki Edytora (Frontend Workspace)

#### A. Trzy główne obszary interfejsu (Workspace Grid):
1.  **Lewy Panel (Zasobnik)**: Lista klocków (przycisków, nawigacji, sekcji testimonial) pobieranych z dynamicznego `mdk-registry`.
2.  **Środkowy Canwas (Obszar Drop)**: Renderuje aktualny `Node Tree State`. Używamy tu **Iframe lub React Portals**, aby odizolować style CSS ramy edytora od ramy budowanej aplikacji.
3.  **Prawy Panel (Inspektor właściwości)**: Kiedy klikniesz klocek (np. `Hero`), panel ten dynamicznie na bazie `propTypes` klocka renderuje kontrolki (inputy, color-pickery).

#### B. Biblioteka Drag & Drop:
*   Zalecany: **`@dnd-kit/core`** – niezwykle elastyczna, wydajna i dostępna (A11Y) biblioteka do przeciągania elementów.

---

### ⚙️ 3. Silnik Generowania Kodu (Code Compiler)
To tutaj dzieje się magia MDK. Zamiast zapisywać JSON do bazy, silnik generuje czysty plik `.tsx`.

#### Podejście A: Modularne Szablony (Szybkie i Lekkie)
Klocki (np. `Button_style_1.txt`) mają placeholdery: `<button style={{ backgroundColor: '{{PRIMARY_COLOR}}' }}>{{TEXT}}</button>`.
MDK parser pętli kaskadę JSON i składa go w długi buffer, który ląduje w pliku `page.tsx`.

#### Podejście B: AST (Abstract Syntax Tree) za pomocą `recast` / `jscodeshift` (Zaawansowane)
Skrypt analizuje strukturę kodu React jak drzewo matematyczne. 
*   **Zaleta**: Możesz "wstrzyknąć" lub "podmienić" zachowanie przycisku bez niszczenia logicznych dependencji importowanych dalej na stronie.
*   Daje to użytkownikowi **stuprocentowy kod**, który po odpędzeniu generatora można pchnąć na produkcję.

---

### 🗺️ Sugerowana Mapa Drogowa Wdrożenia (Roadmap)

| Faza | Moduł | Zadanie |
| :--- | :--- | :--- |
| 🟢 **I** | **Canvas Context** | Stworzenie stanu JSON dla strony oraz dodanie klocków `Section`, `Column` do bazy repo |
| 🟡 **II** | **Workspace UI** | Integracja `@dnd-kit` – przeciąganie klocków z sidebara na środkowy pulpit z odświeżaniem ramy |
| 🟠 **III** | **Property Inspector** | Podpięcie edycji tekstów i kolorów bezpośrednio w bocznym panelu edytora |
| 🔴 **IV** | **Code Renderer V1** | Server Action do parsowania JSON-drzewa do finalnego pliku `/app/page.tsx` w Next.js |
| 🟣 **V** | **Advanced Workspace** | Warstwy (Tree View), przełączniki Smart-CSS dla Flex/Grid oraz stan Historii (Undo/Redo) w Zustand |

---

> [!TIP]
> **Dlaczego to wygra z Elementorem?**
> Elementor generuje tonę kodu kaskadowego w MySQL. MDK wypluje **czysty komponent React**. Deweloper otrzymuje perfekcyjnie optymalny szkielet z natywnym SSR, który nadal może samodzielnie refaktoryzować w VS Code.

Czy taki kierunek architektury oddaje w 100% to, co masz na myśli? Jeśli tak, możemy zacząć od postawienia modelu danych (Phase I)!
