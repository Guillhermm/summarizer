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
| OpenAI | Yes | GPT-4o mini by default. Fast and accurate. |
| Anthropic Claude | Yes | Claude Sonnet by default. |
| Google Gemini | Yes | Gemini 2.5 Flash by default. |
| DeepSeek | Yes | DeepSeek Chat by default. |

Chrome AI is the default. If it is unavailable on your device, select a cloud provider and add your API key in the options page.

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
- Enter your API key (for cloud providers)
- Select the response language (English by default; Chrome AI supports English, Spanish, and Japanese only)

Settings are stored in `chrome.storage.sync` and sync across devices when signed into Chrome.

## Tech stack

- TypeScript + React
- Tailwind CSS v3 (custom prefix, no preflight bleed)
- Webpack 5
- Jest + ts-jest (35 tests across 4 suites)
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
