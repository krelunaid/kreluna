# Kreluna Desktop 1.0

Kreluna è un’applicazione desktop per Windows e macOS. Lumina è il suo ambiente
di lavoro; Windows e macOS restano il sistema operativo e forniscono il kernel.
Luna Runtime esegue i pacchetti `.luna` all’interno di Kreluna.

## Sviluppo web

```bash
pnpm install
pnpm dev
```

La preview web apre su `http://127.0.0.1:8080`.

## Sviluppo desktop

La versione desktop usa Tauri 2 e una build SPA separata, priva di segreti e
dipendenze server.

```bash
pnpm desktop:build
pnpm desktop
```

Per generare gli installer:

```bash
pnpm desktop:bundle
```

Output principali:

- macOS: `.app` e DMG;
- Windows: installer NSIS/MSI;
- frontend locale: `dist-desktop/`.

Su macOS servono Rust, Xcode e l’accettazione personale della licenza Xcode.
Le release pubbliche richiedono inoltre firma e notarizzazione Apple. Su Windows
la build pubblica deve essere firmata per evitare gli avvisi SmartScreen.

Core Desktop usa il motore locale. Il futuro Core online dovrà passare da un
backend Kreluna autenticato: nessuna chiave del fornitore AI va inserita nel
programma o nell’installer.
