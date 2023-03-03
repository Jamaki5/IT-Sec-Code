# Installation

Für die Installation von puppeteer nehmen wir yarn, was zuvor global installiert sein sollte.
Optional geht auch npm dafür.
Folgender Befehl sollte ausgefüht werden:
```bash
npm i
#or
yarn add
```

Puppeteer benötigt um zu funktionieren einen Browser. (z.B.: Chrome, Chromium, etc.)

In dem Ordner `Videos` können alle zu überprüfenden Videos abgelegt werden.

# Nutzung
In den Dateien readFiles.js und sleep.js sind Hilfsfunktionen definiert, die genutzt werden können.  
readFiles.js exportier die gleichnamige Funktion `readFiles`, die automatisch alle Dateien aus dem `Videos` Ordner ausliest und ein Array mit den Pfaden aller Datein zurück gibt, um diese einfach und schnell durch zu gehen.  
Die Datei sleep.js exportiert die gleichnamige Funktion `sleep`, die es ermöglicht einfach und schnell eine die angegebene Zeit in ms zu warten und somit das Programm zu pausieren.

Zum Starten der verschiedenen Automationen muss im Terminal nur folgendes eigegeben werden:

```bash
node path/to/file
```

Manche Automationen benötigen Passwörter oder Nutzerdaten.
Diese müssen in die .env Datein eingetragen werden
