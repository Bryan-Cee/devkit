# DevKit

DevKit is a single-page collection of fast, privacy-friendly developer utilities built with **Vite + React + Tailwind CSS**. Every feature runs **100% client-side** so it can be deployed as a static site on **GitHub Pages** with no backend and no API calls.

## Included tools (v1)

- JSON Viewer & Formatter
- JSON ↔ CSV / YAML Converter
- HTML Viewer
- HTML Formatter / Beautifier / Minifier
- HTML Parser / Entity encoder-decoder
- Markdown Previewer
- URL Parser
- URL Encoder/Decoder
- Base64 Encode/Decode
- JWT Decoder
- Hash Generator
- UUID / ULID Generator
- Timestamp Converter
- Diff Checker
- RegExp Tester
- Case Converter
- Lorem Ipsum / Fake Data Generator
- Color Picker/Converter
- QR Code Generator

## UX highlights

- Single app shell with client-side navigation via `HashRouter`
- Dark/light theme toggle persisted in `localStorage`
- Per-tool input persistence in `localStorage`
- Home screen with recently used tools
- Responsive sidebar layout for desktop and mobile
- Command palette search with `Cmd/Ctrl + K`
- Sandboxed previews for HTML and Markdown rendering

## Local development

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run lint
npm run build
```

## GitHub Pages deployment

A GitHub Actions workflow builds the app on every push to `main` and publishes `dist/` to the `gh-pages` branch.

1. Open repository **Settings → Pages**.
2. Set the source to **Deploy from a branch**.
3. Choose the `gh-pages` branch and `/ (root)` folder.
4. Push to `main` and the workflow will rebuild and publish the latest static bundle.

## Stretch goals (v2)

- Shareable state encoded in the URL hash
- PWA support for offline use
- Export/import of all `localStorage` tool history
