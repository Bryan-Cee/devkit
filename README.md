<div align="center">

# 🧰 DevKit

### The developer toolbox that never leaves your browser.

**Fast. Private. 100% client-side.** No sign-ups, no servers, no data ever leaving your machine.

**🔗 [Live demo →](https://devkit-box.vercel.app/)**

[![Built with Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Deployed on GitHub Pages](https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-222?logo=github&logoColor=white)](https://pages.github.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#-contributing)

</div>

---

## ✨ Why DevKit?

Ever paste a JWT into a random website just to decode it? Or drop sensitive JSON into an online formatter and wonder where it went? **DevKit fixes that.**

It's a single-page collection of everyday developer utilities that runs **entirely in your browser**. Because every feature is client-side, your data never touches a network — making it perfect for working with secrets, tokens, and private payloads. Deploy it once as a static site on GitHub Pages and you've got a zero-backend, zero-cost toolbox available anywhere.

## 🛠️ What's inside

| | | |
|---|---|---|
| 🔍 JSON Viewer & Formatter | 🔄 JSON ↔ CSV / YAML Converter | 🌐 HTML Viewer |
| 🎨 HTML Formatter / Minifier | 🧩 HTML Parser / Entity Coder | 📝 Markdown Previewer |
| 🔗 URL Parser | 🔐 URL Encoder / Decoder | 📦 Base64 Encode / Decode |
| 🎫 JWT Decoder | #️⃣ Hash Generator | 🆔 UUID / ULID Generator |
| ⏱️ Timestamp Converter | 🔀 Diff Checker | ⚡ RegExp Tester |
| 🔡 Case Converter | 🎭 Lorem Ipsum / Fake Data | 🌈 Color Picker / Converter |
| 📱 QR Code Generator | | |

## 💡 Highlights

- 🧭 **Instant navigation** — single app shell with client-side routing (`HashRouter`)
- 🌗 **Dark / light theme** that remembers your choice
- 💾 **Per-tool persistence** — your inputs stick around via `localStorage`
- 🏠 **Recently used tools** right on the home screen
- 📱 **Responsive** sidebar layout for desktop and mobile
- ⌨️ **Command palette** — jump anywhere with `Cmd/Ctrl + K`
- 🛡️ **Sandboxed previews** for safe HTML and Markdown rendering

## 🚀 Quick start

```bash
# Clone the repo
git clone https://github.com/Bryan-Cee/devkit.git
cd devkit

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Then open the local URL Vite prints (usually <http://localhost:5173>).

### ✅ Quality checks

```bash
npm run lint    # lint the codebase
npm run build   # produce the production static bundle
```

## 🌍 Deployment (GitHub Pages)

A GitHub Actions workflow builds the app on every push to `main` and publishes `dist/` to the `gh-pages` branch.

1. Open repository **Settings → Pages**.
2. Set the source to **Deploy from a branch**.
3. Choose the `gh-pages` branch and `/ (root)` folder.
4. Push to `main` — the workflow rebuilds and publishes the latest static bundle automatically.

## 🤝 Contributing

**DevKit is built by developers, for developers — and we'd love your help!** 🎉

Whether it's a brand-new tool, a bug fix, a UX tweak, or a typo in this README, contributions of every size are welcome and appreciated.

### Ways to pitch in

- 🧰 **Add a new tool** — got a utility you reach for constantly? Build it!
- 🐛 **Fix a bug** — check the [issues](https://github.com/Bryan-Cee/devkit/issues) or file a new one
- ✨ **Improve the UX** — polish, accessibility, and design love always welcome
- 📖 **Improve the docs** — clearer instructions help everyone

### How to contribute

1. **Fork** the repository and create your branch from `main`.
2. Make your changes, keeping them focused and self-contained.
3. Run `npm run lint` and `npm run build` to make sure everything is green. ✅
4. **Commit** with a clear message and **open a Pull Request** describing what you changed and why.
5. That's it — a maintainer will review and help get it merged. 🚀

New to open source? No problem. Open an issue, ask questions, and we'll help you find a good first contribution.

## 🔭 Roadmap (v2)

- 🔗 Shareable state encoded in the URL hash
- 📴 PWA support for offline use
- 📤 Export / import of all `localStorage` tool history

---

<div align="center">

If DevKit makes your day a little easier, consider giving it a ⭐ — it helps others discover the project!

</div>
