# Project

A small web project built with Vite, React (TypeScript), and TailwindCSS. It includes a lightweight UI and some utility scripts for ciphers, steganography, QR code, networking tools, and a terminal-like interface.

Made by Shiki

Key files and folders
- `src/` - React TypeScript application entry and components (`App.tsx`, `main.tsx`).
- `styles/` - Project CSS used by the app and pages (Tailwind + custom CSS).
- `scripts/` - Plain JavaScript utilities and features used by the site (examples: `ciphers.js`, `steganography.js`, `netscanner.js`, `terminal.js`).
- `index.html` - App entry HTML used by Vite.
- `package.json` - Project metadata and npm scripts.

What this project does

This project is a small collection of web utilities wrapped in a React frontend. It provides browser-based tools for:

- Text transformations and classical ciphers (encrypt/decrypt).
- Stronger symmetric encryption (AES) using CryptoJS.
- Hash generation and visualization for common hash algorithms.
- Simple utilities for QR code generation and display.
- Additional helper tools in the `scripts/` folder (steganography helpers, network scanning helpers, terminal-like UI, etc.).

Not intended for production security use — the crypto helpers use client-side libraries (CryptoJS) and are primarily educational or for convenience.

Ciphers and crypto features included

Implemented cipher types and crypto features (extracted from `scripts/ciphers.js`):

- Caesar cipher — classical shift cipher with configurable shift (alphabetic characters only).
- Vigenère cipher — polyalphabetic substitution cipher using an alphabetic key.
- Atbash cipher — simple substitution mapping A↔Z, a↔z.
- XOR cipher — symmetric XOR processing with a numeric byte key (0–255).
- AES (CryptoJS) — AES encrypt/decrypt using a passphrase/key (supports 16, 24, or 32-character keys). Uses CryptoJS.AES under the hood.
- Hashing — generate cryptographic hashes and a small visualization for the digest. Supported algorithms: MD5, SHA-1, SHA-256, SHA-512, RIPEMD160.

Additional features in `scripts/ciphers.js`:

- QR code export: outputs can be turned into QR codes via `utils.generateQR` for easy sharing or scanning.
- UI helpers: calls to `ui.showAlert` for user feedback and `security.updateStrength()` for AES strength UI updates.

Other notable scripts

The `scripts/` folder contains multiple utilities used by the site. Files included (examples):

- `auth.js` — authentication-related helpers (UI or token helpers).
- `binary.js` — binary/byte helpers.
- `ciphers.js` — the cipher implementations and hashing (this file).
- `main.js` — site initialization and glue code.
- `netscanner.js` — simple network scanning helper functions.
- `qrcode.min.js` — QR code generation library (minified).
- `security.js` — password/strength helpers and security-related UI.
- `steganography.js` — basic steganography helpers.
- `terminal.js` — a web-based terminal-like interface.
- `ui.js` — UI helpers used across pages.
- `utils.js` — general utility functions (QR helpers, DOM helpers, etc.).


Quick start (local)

1. Install dependencies

```powershell
npm install
```

2. Start the development server

```powershell
npm run dev
```

3. Build for production

```powershell
npm run build
```

Notes on project purpose

This project appears to be a collection of small web tools and UI components. The `scripts/` directory contains several standalone utilities that the website exposes via UI (for example: encoding/decoding ciphers, generating QR codes, simple steganography helpers, and a network scanner script). The React frontend in `src/` ties these utilities together into an interactive single-page interface.

License

This project is released under the MIT License. See `LICENSE` for details.

Contributing

If you plan to contribute, please open issues or pull requests on the repository and include a short description of changes and a minimal reproduction where applicable.

