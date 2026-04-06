# Privacy Policy — Summarizer Extension

**Last updated: April 2026**

## Overview

Summarizer is a Chrome browser extension that assesses web page articles before you read them. This policy describes what data the extension collects, how it is used, and with whom it may be shared.

## Data collected and how it is used

### Page text content
When you click "Assess this page", the extension reads the visible text content of the active tab. This text is:
- Sent to the AI provider you have selected (Chrome AI, OpenAI, Anthropic Claude, Google Gemini, or DeepSeek) to generate a triage assessment.
- Cached locally in your browser (`chrome.storage.local`) for up to 7 days, keyed by page URL, to avoid redundant requests on repeat visits.

The extension does **not** collect, transmit, or store page text on any server operated by the extension developer.

### API keys
If you configure a cloud AI provider, your API key is stored locally in `chrome.storage.sync`. This means it may sync across your Chrome devices if you are signed into Chrome sync. Your API key is sent only to the corresponding provider's API endpoint and is never transmitted to the extension developer.

### Page URLs
The URL of the assessed page is stored locally as a cache key. URLs are not transmitted to any external server by the extension itself (they may be included implicitly in requests to AI providers as part of article context).

### Settings and preferences
Your chosen provider, language preference, and AI model selection are stored in `chrome.storage.sync`. These are not transmitted to the extension developer.

## Third-party AI providers

Depending on the provider you configure, page text may be sent to one of the following third parties:

| Provider | Privacy policy |
|---|---|
| Google (Chrome AI / Gemini) | https://policies.google.com/privacy |
| OpenAI | https://openai.com/privacy |
| Anthropic | https://www.anthropic.com/privacy |
| DeepSeek | https://www.deepseek.com/privacy |

When using Chrome AI, all processing happens on-device and no data is sent to any external server.

## Data the extension does NOT collect

- Browsing history
- Personal information (name, email, location)
- Keystrokes or form inputs
- Any data from pages you do not explicitly assess

## Data retention

Cached assessments are stored locally and automatically expire after 7 days. You can clear them at any time by using the Reset button in the popup or clearing your browser's extension storage.

## Children's privacy

This extension is not directed at children under the age of 13 and does not knowingly collect data from them.

## Changes to this policy

If this policy changes materially, the updated version will be published at the same URL with a revised date.

## Contact

For questions about this privacy policy, open an issue at https://github.com/Guillhermm/summarizer/issues
