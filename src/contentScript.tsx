const extractArticleText = (): string => {
  // Prefer semantic article containers.
  const container =
    document.querySelector('article') ||
    document.querySelector('main') ||
    document.querySelector('[role="main"]');

  if (container) {
    return cleanText((container as HTMLElement).innerText);
  }

  // Fall back to collecting substantial paragraphs.
  const paragraphs = Array.from(document.querySelectorAll('p'))
    .map((p) => p.textContent?.trim() ?? '')
    .filter((t) => t.length > 80);

  return paragraphs.join('\n\n');
};

const cleanText = (text: string): string =>
  text
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\t/g, ' ')
    .trim();

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'extractText') {
    try {
      sendResponse({ text: extractArticleText(), title: document.title });
    } catch (err) {
      console.error('[Triage] Text extraction failed:', err);
      sendResponse({ text: '', title: document.title });
    }
  }
});
