# Summarizer

A Chrome extension that triages any article before you commit your time — surfacing the main argument, estimated reading time, content type, knowledge level, and a plain verdict.

## What it does

Click the extension on any article or blog post and get:

- **Verdict** — Worth reading, Optional, or Skip it
- **Argument** — The central claim in one sentence
- **Reading time** — Estimated based on word count
- **Content type** — News, Opinion, Research, Tutorial, Marketing, or Other
- **Knowledge level** — Casual, Technical, or Academic
- **Verdict reason** — One honest sentence explaining the call

Results are cached per URL for 7 days. Use the **Reassess** button in the popup to force a fresh assessment.

## AI Providers

Summarizer supports multiple AI backends. Configure your preferred provider in the extension options.

| Provider | Key required | Notes |
|---|---|---|
| Chrome AI | No | On-device (Gemini Nano), private, may be slower. Chrome 138+ only. |
| OpenAI | Yes | Key starts with `sk-`. |
| Anthropic Claude | Yes | Key starts with `sk-ant-`. |
| Google Gemini | Yes | Key starts with `AIza`. |
| DeepSeek | Yes | Key starts with `sk-`. |

Chrome AI is the default. If it is unavailable on your device, select a cloud provider and add your API key in the options page.

### API key verification and model lists

Cloud providers retire model names on their own schedule, so the extension does not
ship a fixed catalog. Paste your API key in the options page and press tab: the
extension calls the provider's model listing endpoint, which reports whether the key
works and returns exactly the models that key can currently use.

- **Key accepted**: the Model dropdown is replaced with the provider's live catalog.
  A previously saved model the provider no longer offers is swapped for the newest
  one it does.
- **Key rejected**: the field reports an invalid key and the dropdown keeps its
  bundled fallback list.
- **Provider unreachable**: the field says so, and nothing is changed.

A replacement model is written to storage immediately, not on Save, because the
model it replaced is one the provider has already refused.

Verifying a key proves it is a real key, not that the account can spend. Providers
accept a listing request on an account that will refuse a completion, so a key can
verify and still fail at assessment time with, for example, an exhausted balance.
The popup repeats whatever the provider said in that case.

Until a key is verified, the dropdown shows a small bundled fallback list. Those
entries are a starting point, not a guarantee: only the live catalog is authoritative.

The extension declares `host_permissions` for the four provider APIs. Chrome grants
extension pages a CORS exemption only for hosts listed there, which is what lets the
options page and popup call these APIs directly with your own key.

### Chrome AI setup

Chrome AI requires manual setup and does not work out of the box:

1. Chrome 138 or later on desktop (not supported on mobile)
2. At least 22 GB free storage on the volume with your Chrome profile
3. 16 GB RAM, or a GPU with 4 GB+ VRAM
4. Open `chrome://flags`, search for **Optimization Guide On Device Model**, and set it to **Enabled**
5. Restart Chrome and wait for the model to download (~1.7 GB)

## Installation

### From source

1. Clone the repository:
   ```bash
   git clone https://github.com/Guillhermm/summarizer.git
   cd summarizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Open Chrome and go to `chrome://extensions`
5. Enable **Developer mode** (top right)
6. Click **Load unpacked** and select the `dist/` folder

### Development

Run the dev server with live reload:
```bash
npm start
```

Open `http://localhost:8080/preview/popup.html` or `http://localhost:8080/preview/options.html` to preview components without installing the extension.

## Configuration

Open the extension options (gear icon in the popup) to:

- Choose your AI provider
- Enter your API key (for cloud providers), which is verified against the provider
- Pick a model from the provider's live catalog
- Select the response language (English by default; Chrome AI supports English, Spanish, and Japanese only)

Settings are stored in `chrome.storage.sync` and sync across devices when signed into Chrome.

## Tech stack

- TypeScript + React
- Tailwind CSS v3 (custom prefix, no preflight bleed)
- Webpack 5
- Jest + ts-jest + React Testing Library (66 tests across 8 suites)
- ESLint + Prettier
- GitHub Actions CI (lint + test on every push)

## Tests

```bash
npm test
```

## Lint

```bash
npm run lint
```

## Contributing

Feel free to open [issues](https://github.com/Guillhermm/summarizer/issues) for bugs or feature requests.

To contribute code, fork the repository and open a pull request. Only the repository owner can merge.
