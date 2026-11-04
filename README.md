# Rudra AI ⚡ — Next-Gen Intelligence & Web App Studio

**Rudra AI** is a cutting-edge AI application featuring a Google Gemini 2.5-inspired user interface, lightning-fast response times, ChatGPT-grade reasoning accuracy, and an integrated **Live App Canvas / Sandbox** capable of generating, running, and refining interactive websites and web applications in real-time.

---

## ✨ Features

- **Google Gemini 2.5 Aesthetic**:
  - Cosmic 4-point star glowing brand identity.
  - Floating pill-style prompt bar with auto-resizing input.
  - Collapsible sidebar with chat management (session history, rename, delete).
  - Modern dark slate theme (`#131314` and `#1e1f20`) matching Gemini.

- **🚀 Interactive Live App Sandbox (Rudra Canvas)**:
  - Automatically identifies generated web apps (HTML, CSS, JS, Tailwind).
  - One-click **"Run Web App"** execution in an isolated sandbox.
  - Split-view interface with responsive preview mode (Desktop, Tablet 768px, Mobile 375px).
  - Live code inspector with syntax formatting, copy, and standalone `.html` download.
  - Interactive "Refine App" prompt bar to iterate on designs with voice or text.

- **🧠 Multi-Model Intelligence & Deep Think**:
  - **Rudra 2.5 Flash**: Ultra-responsive, instant token streaming.
  - **Rudra 2.5 Pro**: High-complexity architectural analysis and in-depth software engineering.
  - **Rudra Deep Think (o3/R1 style)**: Unfolds internal chain-of-thought reasoning steps with duration benchmarks.
  - Direct integration with the **Google Gemini API** (`gemini-2.0-flash`, `gemini-1.5-pro`).
  - Built-in intelligent offline engine for instant out-of-the-box demos (Solar System simulator, Cyberpunk Snake game, Glassmorphic calculator, AI SaaS landing page).

- **🎙️ Speech & Productivity**:
  - Integrated Voice Input (Web Speech API speech-to-text).
  - Text-to-Speech audio reader for listening to AI answers.
  - Web search grounding toggle.
  - Local persistence for conversation history, API keys, and custom system instructions.

---

## 🚀 Getting Started

The project is located at:
`C:\Users\Lakshit\.gemini\antigravity\scratch\rudra-ai`

### 1. Run Development Server
```bash
cd C:\Users\Lakshit\.gemini\antigravity\scratch\rudra-ai
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 2. Connect Your Google Gemini API Key (Optional)
1. Click the **Settings & API Keys** icon on the sidebar or top navigation bar.
2. Enter your free Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3. Click **Save & Apply**.
*(If no API key is entered, Rudra AI automatically runs in high-speed built-in demo mode!)*

### 3. Build for Production
```bash
npm run build
```
The optimized bundle will be created in the `dist/` directory, ready to deploy to Vercel, Netlify, or GitHub Pages.
