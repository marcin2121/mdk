# 🗺️ Roadmap Rozwoju - MDK Visual Builder

### 🟢 Fazy Zakończone (Core Canvas)
1.  **Model Danych (JSON Canvas Tree)**: Stabilna struktura, definiowanie propsów, bindowanie zmiennych.
2.  **Workspace UI & Drag & Drop**: Kompletna integracja `@dnd-kit` ze stabilną logiką gniazdowania, systemem poziomów (depth) oraz sensorami nacisku.
3.  **Inspektor (Side Panel)**: Szybki layout, nowoczesne **Style Presets** (Glass, Neon, Soft clay) oraz reaktywne selektory Zustand.
4.  **Code Compiler & Parser**: Server Action generujące czysty kod JSX oraz parser AST do importowania płaskiego kodu do klocków.

---

### 🟡 Etap 1: Dynamiczne Dane & Pętle (Loops)
*   **Wprowadzenie kontenera `Loop`**: Specjalny klocek umożliwiający mapowanie tablic data (np. z API) na powtarzalny zestaw pod-klocków.
*   **Dynamic Variables Extension**: Obsługa bardziej złożonych struktur danych (Arrays / Objects) w bocznym panelu zmiennych.

---

### 🟠 Etap 2: Asset Management & Media pikers
*   **Klocek `Image`**: Integracja z formularzem Uploadu zamiast statycznych placeholderów.
*   **Wbudowany Icon Picker**: Łatwe wstawianie ikon (np. `lucide` lub `remix`) bezpośrednio z poziomu panelu Inspektora klocka.

---

### 🔴 Etap 3: Akcje i Interaktywność (onClick Mappings)
*   **Obsługa Eventów**: Możliwość definiowania akcji dla przycisków:
    *   `Otwórz Modal` / `Zamknij Modal`
    *   `Wysmaruj Submit Form` / `Wywołaj API endpoint`
    *   `Nawigacja (Link)`

---

### 🟣 Etap 4: Global Design System (Themes)
*   **Central Theme Controller**: Moduł w topbarze pozwalający jednym kliknięciem zmienić globalną paletę kolorystyczną (Primary/Secondary), zaokrąglenia (Border Radius) oraz typografię (Font Family) dla całej budowanej aplikacji.
