# JGS Akee - Local Development

Dieser Ordner enthält die Website für JGS Akee. Da das Projekt nun eine PHP-Struktur nutzt, muss für die lokale Ausführung ein PHP-Server laufen.

## 1. Voraussetzungen

Um das Projekt lokal mit automatischem Neuladen (Auto-Reload) zu testen, benötigt Ihr:

*   **Node.js & NPM** (bereits installiert)
*   **PHP** (muss eventuell auf dem Mac nachinstalliert werden)

## 2. Installation

1.  **PHP installieren (falls nicht vorhanden):**
    Öffnet Euer Terminal und führt diesen Befehl aus:
    ```bash
    brew install php
    ```

2.  **Abhängigkeiten für das Development-Setup installieren:**
    ```bash
    npm install
    ```

## 3. Lokale Entwicklung starten

Um den lokalen Server mit Auto-Reload und automatischem CSS-Kompilieren (Sass) zu starten:

```bash
npm run dev
```

Der Server ist dann unter `http://localhost:3000` erreichbar. Änderungen an `.php`, `.html`, `.scss` oder `.js` Dateien werden sofort im Browser aktualisiert.

## 4. Hilfreiche Befehle

*   `npm run build:sass`: Kompiliert das CSS einmalig für den Export.
*   `php -S localhost:8000`: Startet nur den PHP-Server ohne Auto-Reload.
