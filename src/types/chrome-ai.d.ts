// ─── Summarizer API (stable, Chrome 138+) ────────────────────────────────────

type SummarizerAvailability = 'available' | 'downloadable' | 'unavailable';

interface SummarizerCreateOptions {
  type?: 'key-points' | 'teaser' | 'headline';
  format?: 'plain-text' | 'markdown';
  length?: 'short' | 'medium' | 'long';
  outputLanguage?: string;
  monitor?: (monitor: EventTarget) => void;
  signal?: AbortSignal;
}

interface SummarizerSummarizeOptions {
  context?: string;
  outputLanguage?: string;
  signal?: AbortSignal;
}

interface SummarizerInstance {
  summarize(text: string, options?: SummarizerSummarizeOptions): Promise<string>;
  destroy(): void;
  ready: Promise<void>;
}

interface SummarizerAvailabilityOptions {
  type?: 'key-points' | 'teaser' | 'headline';
  format?: 'plain-text' | 'markdown';
  length?: 'short' | 'medium' | 'long';
  outputLanguage?: string;
}

interface SummarizerFactory {
  availability(options?: SummarizerAvailabilityOptions): Promise<SummarizerAvailability>;
  create(options?: SummarizerCreateOptions): Promise<SummarizerInstance>;
}

// ─── Language Model / Prompt API (experimental) ───────────────────────────────

interface LanguageModelCapabilities {
  available: SummarizerAvailability;
}

interface LanguageModelCreateOptions {
  systemPrompt?: string;
  temperature?: number;
  topK?: number;
}

interface LanguageModelSession {
  prompt(input: string): Promise<string>;
  destroy(): void;
}

interface LanguageModelFactory {
  capabilities(): Promise<LanguageModelCapabilities>;
  create(options?: LanguageModelCreateOptions): Promise<LanguageModelSession>;
}

interface WindowAI {
  languageModel?: LanguageModelFactory;
}

// ─── Globals ──────────────────────────────────────────────────────────────────

declare global {
  // Stable global since Chrome 138 (not window.ai.summarizer).
  var Summarizer: SummarizerFactory | undefined;

  interface Window {
    ai?: WindowAI;
  }
}

export {};
