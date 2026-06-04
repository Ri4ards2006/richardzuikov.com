# Richard Zuikov Portfolio (v2.026)

Das persönliche System- und Softwarearchitektur-Portfolio von Richard Zuikov.

## 🚀 Recent Patches & Tweaks (rettung branch)

Hier sind die wichtigsten Änderungen, Optimierungen und neuen Features, die in diesem Patch eingepflegt wurden:

### 1. Pure White Theme Inversion ☀️
* **Code-Editor-Style**: Der Hintergrund im Light-Mode wurde von Beige/Sand auf ein klares, reines Weiß (`#ffffff` / `bg-white`) umgestellt.
* **Farb-Invertierung**: Sämtliche Texte, Icons, Borders und Tabellen wurden kontraststark invertiert (dunkle Schrift auf weißem Grund), damit das Portfolio in beiden Modi optimal lesbar ist.
* **Layout-Bereinigungen**: Ungültige CSS-Hilfsklassen (wie `bg-zinc-55`, `text-zinc-650` etc.) wurden durch standardkonforme Tailwind-Klassen ersetzt, wodurch der Build sauber durchläuft.

### 2. Header & Menu Overlay Rework 🧭
* **Zentralisierte Controls**: Die Buttons für Sprachwechsel (`[DE] / [EN]`), Theme-Toggle und Schließen wurden oben rechts im Menü-Overlay in einer einheitlichen Reihe runder Icons zusammengefasst.
* **Vertical MENU Label**: Auf der linken Seite befindet sich nun der markante, um 90 Grad gedrehte „MENU“-Schriftzug mit der Basis nach links.
* **Clean Layout**: Die biografische Kurzbeschreibung wurde im unteren Footer-Bereich des Menüs platziert, Trennlinien wurden entfernt und Abstände stabilisiert.

### 3. Dynamic 3D Marquee on Home 🖼️
* Das schwebende 3D-Bilderraster im Hintergrund der Startseite lädt nun einen dynamischen Mix aus deinen echten Fotos (Feuerwehr, Reisen, Sport) statt einer einzigen, sich wiederholenden Grafik.

### 4. About-Page Erweiterung: Travels & Activities 🗺️
* **Life Beyond the Console**: Auf der Sektion „Über mich“ wurde eine neue Galerie-Sektion für deine privaten Aktivitäten integriert.
* **Aesthetic Grid**: Ein polaroidartiges Raster zeigt Impressionen deiner Auslandsreisen (Südkorea, China, Dänemark, Usbekistan), deines Feuerwehr-Ehrenamts und deines Ausgleichs im Gym.
* **Micro-Animations**: Die Bilder blenden sich beim Hovern fließend von Schwarz-Weiß in Farbe ein und vergrößern sich dezent.

---

## 🛠️ Tech-Stack
* **Frontend**: React + Vite
* **Styling**: Tailwind CSS & SCSS
* **Animationen**: Framer Motion
* **Routing**: React Router DOM

## 📦 Lokale Entwicklung & Build

**Dev-Server starten:**
```bash
npm run dev
```

**Produktions-Build generieren:**
```bash
npm run build
```
*(Generiert die optimierten Assets im `dist/`-Verzeichnis)*
