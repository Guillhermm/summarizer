import { TriageResult } from '../types/triage';

const calcReadingTime = (text: string): string => {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `~${minutes} min`;
};

// Chrome AI Summarizer only supports these output languages (BCP-47 base codes).
const SUPPORTED_LANGUAGES = ['en', 'es', 'ja'];

const toSupportedLanguage = (locale: string): string => {
  const base = locale.split('-')[0].toLowerCase();
  return SUPPORTED_LANGUAGES.includes(base) ? base : 'en';
};

export const getChromeAITriage = async (text: string, language = 'en-US'): Promise<TriageResult> => {
  // The correct API since Chrome 138 is the global `Summarizer` — not window.ai.summarizer.
  if (typeof Summarizer === 'undefined') {
    throw new Error(
      "Chrome AI is not available. Make sure you're on Chrome 138+ and open chrome://flags to enable 'Optimization Guide On Device Model'."
    );
  }

  const outputLanguage = toSupportedLanguage(language);
  const summarizerOptions = { type: 'teaser' as const, format: 'plain-text' as const, length: 'short' as const, outputLanguage };

  const availability = await Summarizer.availability(summarizerOptions);
  console.log('[Triage] Chrome AI Summarizer availability:', availability);

  if (availability === 'unavailable') {
    throw new Error(
      'Chrome AI Summarizer is unavailable on this device. Your system may not meet the requirements (22 GB free storage, 16 GB RAM).'
    );
  }

  const summarizer = await Summarizer.create({
    ...summarizerOptions,
    monitor(m) {
      m.addEventListener('downloadprogress', (e: Event) => {
        const progress = e as ProgressEvent;
        console.log(`[Triage] Chrome AI model download: ${Math.round(progress.loaded * 100)}%`);
      });
    },
  });

  // If downloadable, wait for the model to finish before summarizing.
  await summarizer.ready;

  const raw = await summarizer.summarize(text, { outputLanguage });
  summarizer.destroy();

  // Chrome AI may prefix the summary with a bullet or dash — strip it.
  const summary = raw.replace(/^[\s*\-•]+/, '').trim();

  return {
    argument: summary,
    readingTime: calcReadingTime(text),
    contentType: 'other',
    knowledgeLevel: 'casual',
    verdict: 'optional',
    verdictReason:
      'Summarized on-device via Chrome AI. Select a cloud provider for a full triage assessment.',
    poweredBy: 'chrome-ai',
  };
};
